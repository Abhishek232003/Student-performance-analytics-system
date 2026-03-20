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
        state = {
            "user_query": message
        }

        # Run LangGraph
        from llm.agents.agent_graph import build_graph
        graph = build_graph()

        result = graph.invoke(state)

        return jsonify({
            "response": result.get("final_response"),
            "intent": result.get("intent"),
            "debug": result.get("debug")
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
    
    
