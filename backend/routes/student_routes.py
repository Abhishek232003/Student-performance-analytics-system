from flask import Blueprint, jsonify, request
from services.db import get_db_connection
from ml.predictor import predict_risk  

student_bp = Blueprint("students", __name__)


@student_bp.route("/", methods=["GET"])
def get_students():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Students")
    students = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(students)



@student_bp.route("/predict", methods=["POST"])
def predict_student_risk():
    try:
        data = request.get_json()

        attendance = data.get("attendance")
        internal_marks = data.get("internal_marks")
        assignment = data.get("assignment")
        behavior = data.get("behavior")

        
        risk = predict_risk(
            attendance,
            internal_marks,
            assignment,
            behavior
        )

        return jsonify({
            "predicted_risk": risk
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

