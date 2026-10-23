import uuid
from flask import Blueprint, request, jsonify
from app.models import db, Plan, Task

plans_bp = Blueprint("plans", __name__, url_prefix="/api/plans")

def get_session_id():
    return request.headers.get("X-Session-Id", "default_session")

@plans_bp.route("", methods=["GET"])
def get_plans():
    """Retrieve all saved plans."""
    session_id = get_session_id()
    query = Plan.query
    if session_id and session_id != "default_session":
        plans = query.filter((Plan.session_id == session_id) | (Plan.session_id == None)).order_by(Plan.updated_at.desc()).all()
    else:
        plans = query.order_by(Plan.updated_at.desc()).all()

    return jsonify({
        "ok": True,
        "success": True,
        "plans": [plan.to_dict(include_tasks=True) for plan in plans]
    }), 200

@plans_bp.route("/<plan_id>", methods=["GET"])
def get_plan(plan_id):
    """Retrieve a single plan by ID."""
    plan = Plan.query.get(plan_id)
    if not plan:
        return jsonify({
            "ok": False,
            "success": False,
            "error": {"code": "not_found", "message": f"Plan '{plan_id}' not found.", "retryable": False}
        }), 404

    return jsonify({
        "ok": True,
        "success": True,
        "plan": plan.to_dict(include_tasks=True)
    }), 200

@plans_bp.route("", methods=["POST"])
def create_or_save_plan():
    """Create or save a plan (draft -> saved)."""
    data = request.get_json() or {}
    session_id = get_session_id()

    # Supports both {"plan": {...}} or direct {...}
    p_data = data.get("plan", data)
    title = p_data.get("title", "My Plan")
    objective = p_data.get("objective") or p_data.get("summary") or ""
    tasks_input = p_data.get("tasks", [])

    plan_id = p_data.get("id")
    if plan_id and not plan_id.startswith("draft_"):
        existing = Plan.query.get(plan_id)
        if existing:
            existing.title = title
            existing.objective = objective
            existing.summary = objective
            existing.status = "saved"
            db.session.commit()
            return jsonify({"ok": True, "success": True, "plan": existing.to_dict(include_tasks=True)}), 200

    new_plan = Plan(
        id=f"plan_{uuid.uuid4().hex[:12]}",
        session_id=session_id,
        title=title,
        objective=objective,
        summary=objective,
        status="saved",
        daily_capacity_minutes=p_data.get("dailyCapacityMinutes") or p_data.get("daily_capacity_minutes") or 60
    )
    db.session.add(new_plan)
    db.session.flush()

    for idx, t in enumerate(tasks_input, start=1):
        task = Task(
            id=f"task_{uuid.uuid4().hex[:12]}",
            plan_id=new_plan.id,
            title=t.get("title", f"Task {idx}"),
            description=t.get("description", ""),
            day=t.get("day") or t.get("due_date") or f"Day {idx}",
            minutes=t.get("minutes") or t.get("estimated_minutes") or t.get("estimatedMinutes") or 30,
            priority=t.get("priority", "medium"),
            done=bool(t.get("done") or t.get("is_completed") or t.get("isCompleted")),
            position=float(t.get("position", idx))
        )
        db.session.add(task)

    db.session.commit()
    return jsonify({
        "ok": True,
        "success": True,
        "plan": new_plan.to_dict(include_tasks=True)
    }), 201

@plans_bp.route("/<plan_id>", methods=["PATCH"])
def update_plan(plan_id):
    """Update plan details."""
    plan = Plan.query.get(plan_id)
    if not plan:
        return jsonify({
            "ok": False,
            "success": False,
            "error": {"code": "not_found", "message": f"Plan '{plan_id}' not found.", "retryable": False}
        }), 404

    data = request.get_json() or {}
    if "title" in data:
        plan.title = data["title"]
    if "objective" in data:
        plan.objective = data["objective"]
    if "summary" in data:
        plan.summary = data["summary"]
    if "status" in data:
        plan.status = data["status"]

    db.session.commit()
    return jsonify({
        "ok": True,
        "success": True,
        "plan": plan.to_dict(include_tasks=True)
    }), 200

@plans_bp.route("/<plan_id>", methods=["DELETE"])
def delete_plan(plan_id):
    """Delete a plan."""
    plan = Plan.query.get(plan_id)
    if not plan:
        return jsonify({
            "ok": False,
            "success": False,
            "error": {"code": "not_found", "message": f"Plan '{plan_id}' not found.", "retryable": False}
        }), 404

    db.session.delete(plan)
    db.session.commit()
    return jsonify({
        "ok": True,
        "success": True,
        "deleted_id": plan_id,
        "message": f"Plan '{plan_id}' deleted."
    }), 200

@plans_bp.route("/<plan_id>/tasks", methods=["POST"])
def add_task_to_plan(plan_id):
    """Add a new task to an existing plan."""
    plan = Plan.query.get(plan_id)
    if not plan:
        return jsonify({
            "ok": False,
            "success": False,
            "error": {"code": "not_found", "message": f"Plan '{plan_id}' not found.", "retryable": False}
        }), 404

    data = request.get_json() or {}
    current_max_pos = max([t.position for t in plan.tasks], default=0.0)

    new_task = Task(
        id=f"task_{uuid.uuid4().hex[:12]}",
        plan_id=plan.id,
        title=data.get("title", "New Task"),
        description=data.get("description", ""),
        day=data.get("day") or data.get("due_date") or "Next session",
        minutes=data.get("minutes") or data.get("estimated_minutes") or 30,
        priority=data.get("priority", "medium"),
        done=bool(data.get("done", False)),
        position=current_max_pos + 1.0
    )
    db.session.add(new_task)
    db.session.commit()

    return jsonify({
        "ok": True,
        "success": True,
        "task": new_task.to_dict(),
        "plan": plan.to_dict(include_tasks=True)
    }), 201
