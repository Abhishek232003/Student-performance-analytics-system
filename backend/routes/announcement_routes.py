from flask import Blueprint, request, jsonify
from services.db import get_db_connection

announcement_bp = Blueprint("announcements", __name__)

@announcement_bp.route("/", methods=["GET"])
def get_announcements():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Announcements ORDER BY created_at DESC")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data)


@announcement_bp.route("/", methods=["POST"])
def create_announcement():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO Announcements (message) VALUES (%s)",
        (data["message"],)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Announcement sent"}), 201
