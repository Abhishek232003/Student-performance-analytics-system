from flask import Blueprint, request, jsonify
from services.db import get_db_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json
    user_id = data.get("user_id")
    password = data.get("password")
    role = data.get("role")   # 👈 get role from frontend

    if not user_id or not password or not role:
        return jsonify({"error": "Missing credentials"}), 400

    # convert frontend role to database role
    expected_role = "teacher" if role == "Faculty" else "student"

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # STRICT LOGIN CHECK
    cursor.execute(
        "SELECT * FROM Users WHERE user_id=%s AND password=%s AND role=%s",
        (user_id, password, expected_role)
    )

    user = cursor.fetchone()

    if not user:
        cursor.close()
        conn.close()
        return jsonify({"error": "Invalid credentials"}), 401


    # =========================
    # TEACHER LOGIN
    # =========================
    if expected_role == "teacher":

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
            WHERE t.user_id = %s
        """, (user_id,))

        teacher = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify({
            "user_id": user["user_id"],
            "role": "teacher",
            "teacher_id": teacher["teacher_id"],
            "name": teacher["name"],
            "email": teacher["email"],
            "photo_url": teacher["photo_url"],
            "department": teacher["department_name"],
            "section": teacher["section_name"]
        })


    # =========================
    # STUDENT LOGIN
    # =========================
    if expected_role == "student":

        cursor.execute("""
            SELECT 
                student_id,
                name,
                email,
                section_id
            FROM Students
            WHERE user_id = %s
        """, (user_id,))

        student = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify({
            "user_id": user["user_id"],
            "role": "student",
            "student_id": student["student_id"],
            "name": student["name"],
            "email": student["email"],
            "section_id": student["section_id"]
        })
    
    