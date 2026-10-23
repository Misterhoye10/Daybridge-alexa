from flask import Blueprint, request, jsonify
from app.services.gemini_agent import GeminiAgent

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")
agent = GeminiAgent()

@chat_bp.route("", methods=["POST"])
def chat():
    """
    Handle conversational interactions with the Daybridge Alexa+ Assistant.
    Complies with API_CONTRACT Section 3: POST /api/chat
    """
    data = request.get_json() or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({
            "ok": False,
            "error": {"code": "validation_error", "message": "Message cannot be empty", "retryable": False}
        }), 400

    session_id = request.headers.get("X-Session-Id") or data.get("sessionId") or "default_session"
    conversation_history = data.get("conversation_history") or data.get("conversationHistory") or []

    # Context plan from request body
    context = data.get("context") or {}
    active_plan_data = context.get("plan") or data.get("currentPlanState")
    active_plan_id = data.get("active_plan_id") or data.get("currentPlanId")

    result = agent.process_chat(
        message=message,
        conversation_history=conversation_history,
        active_plan_data=active_plan_data,
        active_plan_id=active_plan_id,
        session_id=session_id
    )

    return jsonify(result), 200
