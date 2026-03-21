import sys
import os
import traceback

# ✅ Keep path setup
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from flask import Blueprint, request, jsonify
from services.db import get_db_connection  # 🔥 REQUIRED

llm_bp = Blueprint("llm", __name__)


# 🔥 FUNCTION: map user_id → student_id
def get_student_id_from_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT student_id FROM Students WHERE user_id = %s",
        (user_id,)
    )

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return result[0] if result else None


@llm_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message")

    try:
        # 🔥 import graph INSIDE function
        from llm.agents.agent_graph import build_graph
        graph = build_graph()

        # 🔥 STEP 1: get user_id from frontend
        user_id = data.get("student_id")  # actually user_id

        # 🔥 STEP 2: convert to student_id
        real_student_id = get_student_id_from_user(user_id)

        print("USER ID:", user_id)
        print("MAPPED STUDENT ID:", real_student_id)

        # ❗ safety check
        if not real_student_id:
            return jsonify({"error": "Invalid user_id → student mapping"}), 400

        # 🔥 STEP 3: pass correct student_id to LLM
        state = {
            "user_query": message,
            "student_id": real_student_id
        }

        result = graph.invoke(state)

        return jsonify({
            "response": result.get("final_response"),
            "intent": result.get("intent"),
            "debug": result.get("debug")
        })

    except Exception as e:
        print("ERROR:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500