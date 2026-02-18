from flask import Blueprint, request, jsonify
from services.db import get_db_connection

request_bp = Blueprint("requests", __name__)

# GET all requests
@request_bp.route("/", methods=["GET"])
def get_requests():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Requests")
    requests = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(requests)


# CREATE new request
@request_bp.route("/", methods=["POST"])
def create_request():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO Requests (student_name, title, category, risk, status)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            data["student_name"],
            data["title"],
            data["category"],
            data["risk"],
            "Pending"
        )
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Request created successfully"})


# UPDATE request status
@request_bp.route("/<int:request_id>", methods=["PUT"])
def update_request(request_id):
    data = request.json
    status = data.get("status")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE Requests SET status = %s WHERE id = %s",
        (status, request_id)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Request updated successfully"})
