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
    description = data.get("description")

    if not student_id or not teacher_id or not description:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Requests
        (student_id, teacher_id, description, status)
        VALUES (%s, %s, %s, 'Pending')
    """, (student_id, teacher_id, description))

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

# ==============================
# 5️⃣ Get Teachers for Student
# ==============================
@student_portal_bp.route("/teachers/<int:student_id>", methods=["GET"])
def get_teachers_for_student(student_id):

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

    # get teachers for that section
    cursor.execute("""
        SELECT teacher_id, name
        FROM Teachers
        WHERE section_id = %s
    """, (section_id,))

    teachers = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(teachers)


@student_portal_bp.route("/timetable/<int:student_id>", methods=["GET"])
def get_student_timetable(student_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    # Step 1: get student's section
    cursor.execute("""
        SELECT section_id
        FROM Students
        WHERE student_id = %s
    """, (student_id,))

    student = cursor.fetchone()

    if not student:
        return jsonify({"error": "Student not found"}), 404

    section_id = student[0]

    # Step 2: get timetable
    cursor.execute("""
        SELECT day_of_week,
               period1, period2, period3,
               period4, period5, period6, period7
        FROM daily_timetable
        WHERE section_id = %s
        ORDER BY
        CASE
            WHEN day_of_week='Monday' THEN 1
            WHEN day_of_week='Tuesday' THEN 2
            WHEN day_of_week='Wednesday' THEN 3
            WHEN day_of_week='Thursday' THEN 4
            WHEN day_of_week='Friday' THEN 5
        END
    """, (section_id,))

    rows = cursor.fetchall()

    timetable = []

    for row in rows:
        timetable.append({
            "day": row[0],
            "periods": [
                row[1], row[2], row[3],
                row[4], row[5], row[6], row[7]
            ]
        })

    cursor.close()
    conn.close()

    return jsonify({
        "section_id": section_id,
        "timetable": timetable
    })