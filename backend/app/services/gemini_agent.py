import json
import logging
import time
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from app.config import Config
from app.models import db, Plan, Task

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Daybridge, an intelligent Alexa+-inspired personal planning assistant.
Tagline: "Say it. Plan it. Get it done."
Your job is to translate user intentions into structured, actionable plans.

You must respond ONLY with a valid JSON object matching this schema:
{
  "message": "Conversational assistant reply to the user.",
  "action_type": "CREATE_PLAN" | "UPDATE_PLAN" | "DELETE_PLAN" | "NONE",
  "action_status": "completed" | "suggested" | "awaiting_confirmation" | "none",
  "plan_title": "Plan title (e.g. Software Engineering Interview Preparation)",
  "plan_summary": "Summary of goals and schedule constraints",
  "target_date": "Target completion date (e.g. Friday)",
  "tasks": [
    {
      "title": "Task title",
      "description": "Short explanation",
      "priority": "high" | "medium" | "low",
      "due_date": "e.g. Monday",
      "estimated_minutes": 60,
      "order": 1
    }
  ],
  "tasks_to_add": [
    {
      "title": "New task title (e.g. Mock Interview)",
      "description": "Short explanation",
      "priority": "high",
      "due_date": "Thursday",
      "estimated_minutes": 60,
      "order": 5
    }
  ],
  "task_updates": [
    {
      "match_keyword": "Keyword matching task to modify (e.g. Day 1, Algorithms)",
      "new_title": "Optional new title",
      "description": "Updated description",
      "estimated_minutes": 30,
      "priority": "low"
    }
  ]
}

BEHAVIOR RULES:
1. If user asks to organize a goal or prep for an interview:
   - action_type = "CREATE_PLAN", action_status = "completed"
   - populate plan_title, plan_summary, target_date, and tasks array.
2. If user requests modifications to an existing active plan (e.g. "make the first day easier and add a mock interview"):
   - action_type = "UPDATE_PLAN", action_status = "completed"
   - put modified existing tasks into task_updates (e.g. lower estimated_minutes).
   - put newly added tasks into tasks_to_add.
3. If user asks advice ("What should I work on first?"):
   - action_type = "NONE", action_status = "none"
   - answer encouragingly in "message" referencing their active plan tasks.
4. If user requests deletion:
   - action_type = "DELETE_PLAN", action_status = "awaiting_confirmation"
"""

class GeminiAgent:
    def __init__(self):
        self.api_key = Config.GEMINI_API_KEY
        self.model = Config.GEMINI_MODEL or "gemini-3-flash-preview"

    def process_chat(
        self,
        message: str,
        conversation_history: Optional[List[Dict[str, Any]]] = None,
        active_plan_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Process conversational query with Daybridge context and execute required actions."""
        history = conversation_history or []
        
        # Build context from active plan if provided
        active_plan_context = ""
        active_plan = None
        if active_plan_id:
            active_plan = Plan.query.get(active_plan_id)
            if active_plan:
                active_plan_context = f"\n\nCURRENT ACTIVE PLAN (ID: {active_plan.id}):\n"
                active_plan_context += json.dumps(active_plan.to_dict(include_tasks=True), indent=2)

        prompt_text = f"{SYSTEM_PROMPT}{active_plan_context}\n\nCONVERSATION HISTORY:"
        for turn in history[-4:]:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            prompt_text += f"\n{role.upper()}: {content}"

        prompt_text += f"\nUSER: {message}\nASSISTANT (JSON):"

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt_text}]}],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )

        parsed = None
        for attempt in range(3):
            try:
                with urllib.request.urlopen(req, timeout=30) as response:
                    result = json.loads(response.read().decode("utf-8"))
                    candidate = result.get("candidates", [{}])[0]
                    text = candidate.get("content", {}).get("parts", [{}])[0].get("text", "")
                    
                    cleaned_text = text.strip()
                    if cleaned_text.startswith("```json"):
                        cleaned_text = cleaned_text[7:]
                    if cleaned_text.endswith("```"):
                        cleaned_text = cleaned_text[:-3]
                    parsed = json.loads(cleaned_text.strip())
                    break
            except urllib.error.HTTPError as e:
                err_body = e.read().decode("utf-8")
                logger.warning(f"Gemini API attempt {attempt+1} error {e.code}: {err_body[:100]}")
                if e.code in (503, 429) and attempt < 2:
                    time.sleep(2 * (attempt + 1))
                    continue
                return {
                    "reply": "I'm having a brief issue reaching the AI service. Please try again in a moment.",
                    "action": {"type": "NONE", "status": "failed", "error": f"AI error {e.code}"}
                }
            except Exception as e:
                logger.error(f"Error calling Gemini: {e}")
                if attempt < 2:
                    time.sleep(2)
                    continue
                return {
                    "reply": "I encountered an error processing that request. Please try again.",
                    "action": {"type": "NONE", "status": "failed", "error": str(e)}
                }

        if not parsed:
            return {
                "reply": "I couldn't generate a valid plan right now. Please try again.",
                "action": {"type": "NONE", "status": "failed", "error": "No response"}
            }

        # Execute backend actions according to PRD requirements
        action_type = parsed.get("action_type", "NONE")
        action_status = parsed.get("action_status", "none")
        reply_message = parsed.get("message", "Here is your plan update.")
        action_result = {
            "type": action_type,
            "status": action_status,
            "data": None
        }

        try:
            if action_type == "CREATE_PLAN":
                tasks_input = parsed.get("tasks", [])
                new_plan = Plan(
                    title=parsed.get("plan_title", "My Plan"),
                    summary=parsed.get("plan_summary", ""),
                    target_date=parsed.get("target_date")
                )
                db.session.add(new_plan)
                db.session.flush()

                for idx, t in enumerate(tasks_input, start=1):
                    task = Task(
                        plan_id=new_plan.id,
                        order=t.get("order", idx),
                        title=t.get("title", f"Task {idx}"),
                        description=t.get("description", ""),
                        priority=t.get("priority", "medium"),
                        due_date=t.get("due_date"),
                        estimated_minutes=t.get("estimated_minutes", 30)
                    )
                    db.session.add(task)
                
                db.session.commit()
                action_result["data"] = new_plan.to_dict(include_tasks=True)
                action_result["status"] = "completed"

            elif action_type == "UPDATE_PLAN" and active_plan:
                # Apply updates to existing tasks
                for upd in parsed.get("task_updates", []):
                    kw = str(upd.get("match_keyword", "")).lower()
                    for t in active_plan.tasks:
                        if kw in t.title.lower() or kw in (t.due_date or "").lower() or str(t.order) in kw:
                            if upd.get("new_title"):
                                t.title = upd["new_title"]
                            if upd.get("description"):
                                t.description = upd["description"]
                            if upd.get("estimated_minutes") is not None:
                                t.estimated_minutes = upd["estimated_minutes"]
                            if upd.get("priority"):
                                t.priority = upd["priority"]

                # Add new tasks
                current_max_order = max([t.order for t in active_plan.tasks], default=0)
                for new_t in parsed.get("tasks_to_add", []):
                    current_max_order += 1
                    task = Task(
                        plan_id=active_plan.id,
                        order=new_t.get("order", current_max_order),
                        title=new_t.get("title", "New Task"),
                        description=new_t.get("description", ""),
                        priority=new_t.get("priority", "high"),
                        due_date=new_t.get("due_date"),
                        estimated_minutes=new_t.get("estimated_minutes", 60)
                    )
                    db.session.add(task)

                db.session.commit()
                action_result["data"] = active_plan.to_dict(include_tasks=True)
                action_result["status"] = "completed"

            elif action_type == "DELETE_PLAN":
                action_result["status"] = "awaiting_confirmation"
                if active_plan:
                    action_result["data"] = {"plan_id": active_plan.id, "title": active_plan.title}

        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed executing backend action: {e}")
            action_result["status"] = "failed"
            action_result["error"] = str(e)

        return {
            "reply": reply_message,
            "action": action_result
        }
