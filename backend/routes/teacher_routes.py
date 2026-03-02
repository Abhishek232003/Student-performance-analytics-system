from flask import Blueprint, request, jsonify
from services.db import get_db_connection
from ml.predictor import predict_risk  # make sure this function exists

teacher_bp = Blueprint("teacher", __name__)


# ==============================
# 1️⃣ Dashboard Info
# ==============================
@teacher_bp.route("/dashboard/<int:teacher_id>", methods=["GET"])
def get_dashboard(teacher_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            t.teacher_id,
            t.name,
            t.email,
            t.photo_url,
            d.department_name,
            s.section_name
        FROM Teachers t
        JOIN Departments d ON t.department_id = d.department_id
        JOIN Sections s ON t.section_id = s.section_id
        WHERE t.teacher_id = %s
    """, (teacher_id,))

    teacher = cursor.fetchone()

    cursor.close()
    conn.close()

    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    return jsonify(teacher)


# ==============================
# 2️⃣ Get Students Under Teacher
# ==============================
@teacher_bp.route("/students/<int:teacher_id>", methods=["GET"])
def get_students(teacher_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT section_id FROM Teachers WHERE teacher_id = %s
    """, (teacher_id,))
    teacher = cursor.fetchone()

    if not teacher:
        cursor.close()
        conn.close()
        return jsonify({"error": "Teacher not found"}), 404

    cursor.execute("""
        SELECT student_id, name, email
        FROM Students
        WHERE section_id = %s
    """, (teacher["section_id"],))

    students = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(students)


# ==============================
# 3️⃣ Get Subjects For Teacher
# ==============================
@teacher_bp.route("/subjects/<int:teacher_id>", methods=["GET"])
def get_subjects(teacher_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT department_id FROM Teachers WHERE teacher_id = %s
    """, (teacher_id,))
    teacher = cursor.fetchone()

    if not teacher:
        cursor.close()
        conn.close()
        return jsonify({"error": "Teacher not found"}), 404

    cursor.execute("""
        SELECT subject_id, subject_name
        FROM Subjects
        WHERE department_id = %s
    """, (teacher["department_id"],))

    subjects = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(subjects)


# ==============================
# 4️⃣ Auto Fetch Academic Details
# ==============================
@teacher_bp.route("/academic-details", methods=["POST"])
def get_academic_details():
    data = request.json
    student_id = data.get("student_id")
    subject_name = data.get("subject_name")

    if not student_id or not subject_name:
        return jsonify({"error": "Missing student_id or subject_name"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT subject_id FROM Subjects WHERE subject_name = %s
    """, (subject_name,))
    subject = cursor.fetchone()

    if not subject:
        cursor.close()
        conn.close()
        return jsonify({"error": "Subject not found"}), 404

    cursor.execute("""
        SELECT attendance, internal_marks, assignment_score, behavior_score
        FROM Academic_records
        WHERE student_id = %s AND subject_id = %s
    """, (student_id, subject["subject_id"]))

    record = cursor.fetchone()

    cursor.close()
    conn.close()

    if not record:
        return jsonify({"error": "Academic record not found"}), 404

    return jsonify(record)


# ==============================
# 5️⃣ Predict Risk
# ==============================
@teacher_bp.route("/predict-risk", methods=["POST"])
def predict():
    data = request.json

    attendance = data.get("attendance")
    internal = data.get("internal_marks")
    assignment = data.get("assignment_score")
    behavior = data.get("behavior_score")

    if None in [attendance, internal, assignment, behavior]:
        return jsonify({"error": "Missing required fields"}), 400

    risk = predict_risk(attendance, internal, assignment, behavior)

    return jsonify({"risk_level": risk})


# ==============================
# 6️⃣ Notify (n8n integration placeholder)
# ==============================
@teacher_bp.route("/notify", methods=["POST"])
def notify_student():
    data = request.json
    student_id = data.get("student_id")

    if not student_id:
        return jsonify({"error": "Missing student_id"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT email, name FROM Students WHERE student_id = %s
    """, (student_id,))
    student = cursor.fetchone()

    cursor.close()
    conn.close()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    # Here you will later trigger n8n webhook
    return jsonify({
        "message": f"Notification triggered for {student['name']}",
        "email": student["email"]
    })

