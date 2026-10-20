from flask import Blueprint, request, jsonify
from app.services.gemini_agent import GeminiAgent
from app.schemas.plan_schemas import ChatRequestSchema

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")
agent = GeminiAgent()

@chat_bp.route("", methods=["POST"])
def chat():
    """
    Handle conversational interactions with the Daybridge Alexa+ Assistant.
    Translates natural-language requests into structured plans and task mutations.
    """
    data = request.get_json() or {}
    try:
        validated = ChatRequestSchema(**data)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

    result = agent.process_chat(
        message=validated.message,
        conversation_history=validated.conversation_history,
        active_plan_id=validated.active_plan_id
    )

    return jsonify({
        "success": True,
        "reply": result["reply"],
        "action": result["action"]
    }), 200
