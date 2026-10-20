from flask import Blueprint, request, jsonify
from app.models import db, Task, Plan
from app.schemas.plan_schemas import TaskUpdateSchema, TaskCreateSchema

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")

@tasks_bp.route("/<task_id>", methods=["PATCH"])
def update_task(task_id):
    """Update task completion status or details."""
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"success": False, "error": f"Task '{task_id}' not found."}), 404

    data = request.get_json() or {}
    try:
        validated = TaskUpdateSchema(**data)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

    if validated.title is not None:
        task.title = validated.title
    if validated.description is not None:
        task.description = validated.description
    if validated.priority is not None:
        task.priority = validated.priority
    if validated.due_date is not None:
        task.due_date = validated.due_date
    if validated.estimated_minutes is not None:
        task.estimated_minutes = validated.estimated_minutes
    if validated.is_completed is not None:
        task.is_completed = validated.is_completed
    if validated.order is not None:
        task.order = validated.order

    db.session.commit()

    # Also return parent plan updated progress
    plan = Plan.query.get(task.plan_id)
    return jsonify({
        "success": True,
        "task": task.to_dict(),
        "plan_progress": plan.progress_percentage if plan else 0
    }), 200

@tasks_bp.route("/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    """Delete a single task."""
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"success": False, "error": f"Task '{task_id}' not found."}), 404

    plan_id = task.plan_id
    db.session.delete(task)
    db.session.commit()

    plan = Plan.query.get(plan_id)
    return jsonify({
        "success": True,
        "message": f"Task '{task_id}' deleted.",
        "plan_progress": plan.progress_percentage if plan else 0
    }), 200
