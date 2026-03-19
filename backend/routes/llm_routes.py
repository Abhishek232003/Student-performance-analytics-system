import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from flask import Blueprint, request, jsonify

# import your agent
from llm.agents.intent_agent import intent_agent
from llm.agents.rag_agent import rag_agent   


llm_bp = Blueprint("llm", __name__)

@llm_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message")

    try:
        # Step 1: create state
        state = {
            "user_query": message
        }

        # Step 2: detect intent
        state = intent_agent(state)
        intent = state.get("intent")

        # 🔥 Step 3: handle based on intent
        if intent == "learning_query":

            # call rag agent (your main AI logic)
            state = rag_agent(state)

            return jsonify({
                "type": "learning",
                "explanation": state.get("answer")
            })

        elif intent == "calendar_action":
            return jsonify({
                "type": "calendar",
                "message": "Calendar feature coming soon"
            })

        return jsonify({
            "type": "unknown",
            "message": "Could not understand"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


    
    
