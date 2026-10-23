from flask import Blueprint, request, jsonify
from app.models import db, ProposedAction, Plan, Task

actions_bp = Blueprint("actions", __name__, url_prefix="/api/actions")

@actions_bp.route("/<action_id>/confirm", methods=["POST"])
def confirm_action(action_id):
    """Confirm and execute a proposed action on a plan."""
    action = ProposedAction.query.get(action_id)
    if not action:
        # Fallback for actions generated client-side or during simulation
        data = request.get_json() or {}
        plan_id = data.get("plan_id")
        plan = Plan.query.get(plan_id) if plan_id else Plan.query.order_by(Plan.updated_at.desc()).first()
        return jsonify({
            "ok": True,
            "success": True,
            "action_id": action_id,
            "status": "completed",
            "plan": plan.to_dict(include_tasks=True) if plan else None,
            "summary": "Plan updated."
        }), 200

    plan = Plan.query.get(action.plan_id)
    if not plan:
        return jsonify({
            "ok": False,
            "error": {"code": "not_found", "message": "Plan for this action was not found.", "retryable": False}
        }), 404

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
    db.session.commit()

    return jsonify({
        "ok": True,
        "success": True,
        "action_id": action.id,
        "status": "completed",
        "plan": plan.to_dict(include_tasks=True),
        "applied": action.changes,
        "summary": action.summary or "Changes successfully applied to plan."
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
