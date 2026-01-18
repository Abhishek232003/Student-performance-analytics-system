from flask import Blueprint, jsonify
from services.db import get_db_connection

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
