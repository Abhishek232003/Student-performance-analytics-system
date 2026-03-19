import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from flask import Blueprint, request, jsonify

# import your agent
from llm.agents.intent_agent import intent_agent

llm_bp = Blueprint("llm", __name__)

@llm_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message")

    try:
        # 🔥 Step 1: create state
        state = {
            "user_query": message
        }

        # 🔥 Step 2: call your intent agent
        updated_state = intent_agent(state)

        # 🔥 Step 3: extract result
        intent = updated_state.get("intent")

        return jsonify({
            "intent": intent,
            "debug": updated_state.get("debug")
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
