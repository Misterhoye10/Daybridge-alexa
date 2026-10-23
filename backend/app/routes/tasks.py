from flask import Blueprint, request, jsonify
from app.models import db, Task, Plan

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

@tasks_bp.route("/<task_id>", methods=["PATCH"])
def update_task(task_id):
    """Update task details or toggle completion status."""
    task = Task.query.get(task_id)
    if not task:
        return jsonify({
            "ok": False,
            "success": False,
            "error": {"code": "not_found", "message": f"Task '{task_id}' not found.", "retryable": False}
        }), 404

    data = request.get_json() or {}

    if "done" in data:
        task.done = bool(data["done"])
    elif "is_completed" in data:
        task.done = bool(data["is_completed"])
    elif "isCompleted" in data:
        task.done = bool(data["isCompleted"])

    if "title" in data:
        task.title = data["title"]
    if "description" in data:
        task.description = data["description"]
    if "priority" in data:
        task.priority = data["priority"]
    if "day" in data:
        task.day = data["day"]
    elif "due_date" in data:
        task.day = data["due_date"]
    if "minutes" in data:
        task.minutes = int(data["minutes"])
    elif "estimated_minutes" in data:
        task.minutes = int(data["estimated_minutes"])
    if "position" in data:
        task.position = float(data["position"])

    db.session.commit()

    plan = Plan.query.get(task.plan_id)
    done_count = sum(1 for t in plan.tasks if t.done) if plan else 0
    total_count = len(plan.tasks) if plan else 0
    minutes_left = sum(t.minutes for t in plan.tasks if not t.done) if plan else 0

    return jsonify({
        "ok": True,
        "success": True,
        "task": task.to_dict(),
        "progress": {
          "done": done_count,
          "total": total_count,
          "minutes_left": minutes_left
        },
        "plan_progress": plan.completion_percentage if plan else 0
    }), 200

@tasks_bp.route("/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    """Delete a single task."""
    task = Task.query.get(task_id)
    if not task:
        return jsonify({
            "ok": False,
            "success": False,
            "error": {"code": "not_found", "message": f"Task '{task_id}' not found.", "retryable": False}
        }), 404

    plan_id = task.plan_id
    db.session.delete(task)
    db.session.commit()

    plan = Plan.query.get(plan_id)
    return jsonify({
        "ok": True,
        "success": True,
        "deleted_id": task_id,
        "plan": plan.to_dict(include_tasks=True) if plan else None
    }), 200
