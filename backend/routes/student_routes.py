from flask import Blueprint, jsonify, request
from services.db import get_db_connection
from ml.predictor import predict_risk

student_bp = Blueprint("students", __name__)


# GET ALL STUDENTS
@student_bp.route("/", methods=["GET"])
def get_students():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Students")
    students = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(students)


# NEW API → FETCH STUDENT ANALYSIS DATA
@student_bp.route("/analysis", methods=["GET"])
def get_student_analysis():

    student_id = request.args.get("student_id")
    subject = request.args.get("subject")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT
            attendance,
            internal_marks,
            assignment_score,
            behavior_score
        FROM Academic_Records ar
        JOIN Subjects s ON ar.subject_id = s.subject_id
        WHERE ar.student_id = %s
        AND s.subject_name = %s
    """

    cursor.execute(query, (student_id, subject))
    record = cursor.fetchone()

    cursor.close()
    conn.close()

    if not record:
        return jsonify({"error": "No data found"}), 404

    return jsonify(record)


# PREDICT RISK
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
    
    