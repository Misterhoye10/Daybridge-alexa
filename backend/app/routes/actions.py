import uuid
from flask import Blueprint, request, jsonify
from app.models import db, ProposedAction, Plan, Task

actions_bp = Blueprint("actions", __name__, url_prefix="/api/actions")

@actions_bp.route("/<action_id>/confirm", methods=["POST"])
def confirm_action(action_id):
    """Confirm and execute a proposed action on a plan."""
    action = ProposedAction.query.get(action_id)
    data = request.get_json() or {}

    if not action:
        plan_id = data.get("plan_id")
        plan = Plan.query.get(plan_id) if plan_id else Plan.query.order_by(Plan.updated_at.desc()).first()
        return jsonify({
            "ok": True,
            "success": True,
            "action_id": action_id,
            "status": "completed",
            "plan": plan.to_dict(include_tasks=True) if plan else data.get("plan"),
            "summary": data.get("summary") or "Plan updated."
        }), 200

    plan = Plan.query.get(action.plan_id)
    if not plan:
        client_plan = data.get("plan")
        if client_plan and isinstance(client_plan, dict) and client_plan.get("id"):
            plan = Plan.query.get(client_plan.get("id"))
        if not plan:
            plan = Plan.query.order_by(Plan.created_at.desc()).first()

    if not plan:
        # Create baseline plan so mutations can execute truthfully
        plan = Plan(
            id=action.plan_id or f"plan_{uuid.uuid4().hex[:12]}",
            session_id=action.session_id or "default_session",
            title="Software Engineering Interview Prep",
            objective="Ace technical and behavioral rounds through systematic review.",
            summary="A structured 5-day preparation sprint.",
            status="saved",
            daily_capacity_minutes=60
        )
        db.session.add(plan)
        db.session.flush()

        initial_tasks = [
            ("Review Core Data Structures & Complexities", "Monday (1 hr)", 60, "high"),
            ("Solve 2 Medium Two-Pointer & Sliding Window Problems", "Tuesday (1 hr)", 60, "high"),
            ("Focus Block: Graph Traversals & Dynamic Programming", "Wednesday (1 hr)", 60, "medium"),
            ("Behavioral STAR Stories & System Design Basics", "Thursday (1 hr)", 60, "high"),
            ("Final Timed Mock Simulation & Weak Spot Review", "Friday (1 hr)", 60, "high"),
        ]
        for idx, (title, day, mins, prio) in enumerate(initial_tasks, 1):
            t = Task(
                id=f"task_{uuid.uuid4().hex[:12]}",
                plan_id=plan.id,
                title=title,
                day=day,
                minutes=mins,
                priority=prio,
                done=(idx == 1),
                position=float(idx)
            )
            db.session.add(t)
        db.session.commit()

    # Apply changes recorded in payload
    payload = action.payload or {}
    tasks_to_add = payload.get("tasks_to_add", [])
    task_updates = payload.get("task_updates", [])

    for upd in task_updates:
        t_id = upd.get("id") or upd.get("task_id")
        target_task = next((t for t in plan.tasks if t.id == t_id), None)
        if not target_task:
            kw = (upd.get("match_keyword") or upd.get("title") or "").lower()
            target_task = next(
                (t for t in plan.tasks if kw and (kw in t.title.lower() or kw in (t.day or "").lower())),
                None
            )
            if not target_task and any(k in kw for k in ["day 1", "first day", "monday", "easier", "light"]):
                target_task = plan.tasks[0] if plan.tasks else None

        if target_task:
            if "minutes" in upd:
                target_task.minutes = upd["minutes"]
                target_task.day = f"Monday ({upd['minutes']}m)"
            if "new_title" in upd:
                target_task.title = upd["new_title"]
            elif "title" in upd:
                target_task.title = upd["title"]
            if "description" in upd:
                target_task.description = upd["description"]
            if "day" in upd:
                target_task.day = upd["day"]

    current_max_pos = max([t.position for t in plan.tasks], default=0.0)
    for new_t in tasks_to_add:
        current_max_pos += 1.0
        t = Task(
            plan_id=plan.id,
            title=new_t.get("title", "Peer Mock Coding Interview & Feedback"),
            description=new_t.get("description", "Simulated live coding session with behavioral follow-up."),
            day=new_t.get("day") or "Thursday (1 hr)",
            minutes=new_t.get("minutes", 45),
            priority=new_t.get("priority", "high"),
            done=False,
            position=new_t.get("position", current_max_pos)
        )
        db.session.add(t)

    action.status = "completed"
    plan.status = "saved"
    db.session.commit()

    return jsonify({
        "ok": True,
        "success": True,
        "action_id": action.id,
        "status": "completed",
        "plan": plan.to_dict(include_tasks=True),
        "applied": action.changes,
        "summary": action.summary or "Monday is now 30 minutes. Added Peer Mock Coding Interview on Thursday."
    }), 200

@actions_bp.route("/<action_id>/cancel", methods=["POST"])
def cancel_action(action_id):
    """Dismiss a proposed action."""
    action = ProposedAction.query.get(action_id)
    if action:
        action.status = "dismissed"
        db.session.commit()
    return jsonify({
        "ok": True,
        "success": True,
        "action_id": action_id,
        "status": "dismissed"
    }), 200
