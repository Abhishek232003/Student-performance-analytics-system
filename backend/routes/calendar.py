from flask import Blueprint, request, jsonify
from services.db import get_db_connection
from datetime import timedelta

calendar_bp = Blueprint("calendar", __name__)

# ---------------------------------------------------
# ADD EVENT
# ---------------------------------------------------
@calendar_bp.route("/add", methods=["POST"])
def add_event():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO calendar_events
        (student_id, title, description, event_date, event_time, event_type, important, created_by)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """,(
        data["student_id"],
        data["title"],
        data.get("description"),
        data["event_date"],
        data.get("event_time")  or "00:00:00",
        data.get("event_type","task"),
        data.get("important",False),
        data.get("created_by","student")
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message":"event added"}),201


# ---------------------------------------------------
# GET ALL EVENTS FOR STUDENT ✅ FIXED
# ---------------------------------------------------
@calendar_bp.route("/<int:student_id>", methods=["GET"])
def get_events(student_id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM calendar_events
        WHERE student_id = %s
        ORDER BY event_date,event_time
    """,(student_id,))

    events = cursor.fetchall()

    # ✅ FIX: Convert date & time to JSON-safe format
    for e in events:
        if e.get("event_date"):
            e["event_date"] = str(e["event_date"])

        if isinstance(e.get("event_time"), timedelta):
            e["event_time"] = str(e["event_time"])

    cursor.close()
    conn.close()

    # ✅ IMPORTANT: return list (not wrapped)
    return jsonify(events)


# ---------------------------------------------------
# FAST MONTH LOADER
# ---------------------------------------------------
@calendar_bp.route("/month/<int:student_id>", methods=["GET"])
def get_month_events(student_id):

    month = request.args.get("month")
    year = request.args.get("year")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id,title,event_date,event_time,event_type,important,status
        FROM calendar_events
        WHERE student_id=%s
        AND MONTH(event_date)=%s
        AND YEAR(event_date)=%s
        ORDER BY event_date,event_time
    """,(student_id,month,year))

    events = cursor.fetchall()

    # ✅ Convert date & time properly
    for e in events:
        if e.get("event_date"):
            e["event_date"] = str(e["event_date"])

        if isinstance(e.get("event_time"), timedelta):
            e["event_time"] = str(e["event_time"])

    cursor.close()
    conn.close()

    return jsonify(events)


# ---------------------------------------------------
# MARK EVENT COMPLETE
# ---------------------------------------------------
@calendar_bp.route("/complete/<int:event_id>", methods=["PATCH"])
def mark_complete(event_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE calendar_events
        SET status='completed'
        WHERE id=%s
    """,(event_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message":"event marked complete"})


# ---------------------------------------------------
# AI ACTION EXECUTOR
# ---------------------------------------------------
def execute_ai_action(action_json):

    action = action_json.get("action")

    conn = get_db_connection()
    cursor = conn.cursor()

    if action == "add_event":

        if not action_json.get("student_id"):
            return {"error": "student_id missing"}
         
        cursor.execute("""
            INSERT INTO calendar_events
            (student_id,title,event_date,event_time,event_type,important,created_by)
            VALUES (%s,%s,%s,%s,%s,%s,'llm')
        """,(
            action_json["student_id"],
            action_json["title"],
            action_json["event_date"],
            action_json.get("event_time"),
            action_json.get("event_type","task"),
            action_json.get("important",False)
        ))

    elif action == "mark_complete":
        cursor.execute("""
            UPDATE calendar_events
            SET status='completed'
            WHERE id=%s
        """,(action_json["event_id"],))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message":"AI action executed"}


