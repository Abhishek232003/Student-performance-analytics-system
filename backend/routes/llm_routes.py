import sys
import os
import traceback

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from flask import Blueprint, request, jsonify

llm_bp = Blueprint("llm", __name__)

@llm_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message")

    try:
        # 🔥 import graph INSIDE function (important)
        from llm.agents.agent_graph import build_graph
        graph = build_graph()

        state = {
            "user_query": message,
            "student_id": data.get("student_id")
        }

        result = graph.invoke(state)

        return jsonify({
            "response": result.get("final_response"),
            "intent": result.get("intent"),
            "debug": result.get("debug")
        })

    except Exception as e:
        print("ERROR:", e)
        traceback.print_exc()   # 🔥 THIS LINE IS KEY
        return jsonify({"error": str(e)}), 500
    
    