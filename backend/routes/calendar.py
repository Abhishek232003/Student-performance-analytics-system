from flask import Blueprint, request, jsonify
from services.db import get_db_connection

calendar_bp = Blueprint("calendar", __name__)

# Add Event
@calendar_bp.route("/add", methods=["POST"])
def add_event():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO calendar_events 
        (student_id, title, description, event_date, event_type, important)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data["student_id"],
        data["title"],
        data.get("description"),
        data["event_date"],
        data.get("event_type"),
        data.get("important", False)
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Event added"}), 201


# Get Events
@calendar_bp.route("/<int:student_id>", methods=["GET"])
def get_events(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM calendar_events
        WHERE student_id = %s
        ORDER BY event_date ASC
    """, (student_id,))

    events = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(events)

# -----------------------------------------
# AI ACTION EXECUTOR (Future Integration)
# -----------------------------------------

def execute_ai_action(action_json):
    action = action_json.get("action")

    conn = get_db_connection()
    cursor = conn.cursor()

    if action == "add_event":
        cursor.execute("""
            INSERT INTO calendar_events 
            (student_id, title, event_date, important)
            VALUES (%s, %s, %s, %s)
        """, (
            action_json["student_id"],
            action_json["title"],
            action_json["event_date"],
            action_json.get("important", False)
        ))

    elif action == "mark_complete":
        cursor.execute("""
            UPDATE calendar_events
            SET status = 'completed'
            WHERE id = %s
        """, (action_json["event_id"],))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "AI action executed"}
