from flask import Blueprint, jsonify, request
from services.db import get_db_connection

student_portal_bp = Blueprint("student_portal", __name__)

# ==============================
# 1️⃣ Student Dashboard
# ==============================
@student_portal_bp.route("/dashboard/<int:student_id>", methods=["GET"])
def get_student_dashboard(student_id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            s.student_id,
            s.name,
            s.email,
            sec.section_name,
            d.department_name
        FROM Students s
        JOIN Sections sec 
            ON s.section_id = sec.section_id
        JOIN Departments d 
            ON sec.department_id = d.department_id
        WHERE s.student_id = %s
    """, (student_id,))

    student = cursor.fetchone()

    cursor.close()
    conn.close()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(student)


# ==============================
# 2️⃣ Create Student Request
# ==============================
@student_portal_bp.route("/requests", methods=["POST"])
def create_request():

    data = request.json

    student_id = data.get("student_id")
    teacher_id = data.get("teacher_id")
    title = data.get("title")
    category = data.get("category")
    description = data.get("description")
    risk = data.get("risk")

    if not student_id or not teacher_id or not title:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Requests 
        (student_id, teacher_id, title, category, description, risk, status)
        VALUES (%s, %s, %s, %s, %s, %s, 'Pending')
    """, (student_id, teacher_id, title, category, description, risk))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Request created successfully"})


# ==============================
# 3️⃣ Get Student Requests
# ==============================
@student_portal_bp.route("/requests/<int:student_id>", methods=["GET"])
def get_student_requests(student_id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            id,
            teacher_id,
            title,
            category,
            description,
            risk,
            status
        FROM Requests
        WHERE student_id = %s
        ORDER BY id DESC
    """, (student_id,))

    requests = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(requests)


# ==============================
# 4️⃣ Student Announcements
# ==============================
@student_portal_bp.route("/announcements/<int:student_id>", methods=["GET"])
def get_student_announcements(student_id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # find student's section
    cursor.execute("""
        SELECT section_id 
        FROM Students
        WHERE student_id = %s
    """, (student_id,))

    student = cursor.fetchone()

    if not student:
        cursor.close()
        conn.close()
        return jsonify({"error": "Student not found"}), 404

    section_id = student["section_id"]

    # get announcements for that section
    cursor.execute("""
        SELECT 
            teacher_id,
            message,
            created_at
        FROM Announcements
        WHERE section_id = %s
        ORDER BY created_at DESC
    """, (section_id,))

    announcements = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(announcements)