from flask import Blueprint, request, jsonify
from app.models import db, Plan, Task
from app.schemas.plan_schemas import PlanCreateSchema, PlanUpdateSchema

plans_bp = Blueprint("plans", __name__, url_prefix="/api/plans")

@plans_bp.route("", methods=["GET"])
def get_plans():
    """Retrieve all saved plans ordered by creation date."""
    plans = Plan.query.order_by(Plan.created_at.desc()).all()
    return jsonify({
        "success": True,
        "plans": [plan.to_dict(include_tasks=True) for plan in plans]
    }), 200

@plans_bp.route("/<plan_id>", methods=["GET"])
def get_plan(plan_id):
    """Retrieve a single plan by its ID."""
    plan = Plan.query.get(plan_id)
    if not plan:
        return jsonify({"success": False, "error": f"Plan '{plan_id}' not found."}), 404
    return jsonify({"success": True, "plan": plan.to_dict(include_tasks=True)}), 200

@plans_bp.route("", methods=["POST"])
def create_plan():
    """Create a new plan with optional tasks."""
    data = request.get_json() or {}
    try:
        validated = PlanCreateSchema(**data)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

    new_plan = Plan(
        title=validated.title,
        summary=validated.summary,
        target_date=validated.target_date
    )
    db.session.add(new_plan)
    db.session.flush()

    for idx, t_data in enumerate(validated.tasks, start=1):
        task = Task(
            plan_id=new_plan.id,
            order=t_data.order or idx,
            title=t_data.title,
            description=t_data.description,
            priority=t_data.priority or "medium",
            due_date=t_data.due_date,
            estimated_minutes=t_data.estimated_minutes or 30
        )
        db.session.add(task)

    db.session.commit()
    return jsonify({"success": True, "plan": new_plan.to_dict(include_tasks=True)}), 201

@plans_bp.route("/<plan_id>", methods=["PATCH"])
def update_plan(plan_id):
    """Update plan metadata (title, summary, target_date, status)."""
    plan = Plan.query.get(plan_id)
    if not plan:
        return jsonify({"success": False, "error": f"Plan '{plan_id}' not found."}), 404

    data = request.get_json() or {}
    try:
        validated = PlanUpdateSchema(**data)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

    if validated.title is not None:
        plan.title = validated.title
    if validated.summary is not None:
        plan.summary = validated.summary
    if validated.target_date is not None:
        plan.target_date = validated.target_date
    if validated.status is not None:
        plan.status = validated.status

    db.session.commit()
    return jsonify({"success": True, "plan": plan.to_dict(include_tasks=True)}), 200

@plans_bp.route("/<plan_id>", methods=["DELETE"])
def delete_plan(plan_id):
    """Delete a plan and all its tasks."""
    plan = Plan.query.get(plan_id)
    if not plan:
        return jsonify({"success": False, "error": f"Plan '{plan_id}' not found."}), 404

    db.session.delete(plan)
    db.session.commit()
    return jsonify({"success": True, "message": f"Plan '{plan_id}' successfully deleted."}), 200
