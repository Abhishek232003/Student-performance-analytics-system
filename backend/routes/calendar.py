from flask import Blueprint, request, jsonify
from services.db import get_db_connection
from datetime import datetime, timedelta

calendar_bp = Blueprint("calendar", __name__)

# ----------------------------------------
# ✅ TIME NORMALIZER (CRITICAL)
# ----------------------------------------
def normalize_time(event_time):
    if not event_time:
        return None

    try:
        event_time = event_time.strip().lower()

        # handle AM/PM
        if "am" in event_time or "pm" in event_time:
            dt = datetime.strptime(event_time, "%I:%M %p")
            return dt.strftime("%H:%M:%S")

        # handle HH:MM
        elif len(event_time.split(":")) == 2:
            dt = datetime.strptime(event_time, "%H:%M")
            return dt.strftime("%H:%M:%S")

        # handle HH:MM:SS
        elif len(event_time.split(":")) == 3:
            dt = datetime.strptime(event_time, "%H:%M:%S")
            return dt.strftime("%H:%M:%S")

    except Exception as e:
        print("❌ TIME ERROR:", event_time, e)
        return None

    return None


# ---------------------------------------------------
# ADD EVENT (API)
# ---------------------------------------------------
@calendar_bp.route("/add", methods=["POST"])
def add_event():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    event_time = normalize_time(data.get("event_time"))

    print("🔥 API RAW TIME:", data.get("event_time"))
    print("🔥 API FINAL TIME:", event_time)

    cursor.execute("""
        INSERT INTO calendar_events
        (student_id, title, description, event_date, event_time, event_type, important, created_by)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """,(
        data["student_id"],
        data["title"],
        data.get("description"),
        data["event_date"],
        event_time,   # ✅ FIXED
        data.get("event_type","task"),
        data.get("important",False),
        data.get("created_by","student")
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message":"event added"}),201


# ---------------------------------------------------
# GET EVENTS
# ---------------------------------------------------
@calendar_bp.route("/<int:user_id>", methods=["GET"])
def get_events(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT student_id FROM Students WHERE user_id = %s
    """, (user_id,))
    result = cursor.fetchone()

    if not result:
        return jsonify([])

    student_id = result["student_id"]

    cursor.execute("""
        SELECT * FROM calendar_events
        WHERE student_id = %s
        ORDER BY event_date, event_time
    """, (student_id,))

    events = cursor.fetchall()

    for e in events:
        if e.get("event_date"):
            e["event_date"] = str(e["event_date"])

        if isinstance(e.get("event_time"), timedelta):
            e["event_time"] = str(e["event_time"])
        elif e.get("event_time"):
            e["event_time"] = str(e["event_time"])

    cursor.close()
    conn.close()

    return jsonify(events)


# ---------------------------------------------------
# AI ACTION EXECUTOR (🔥 MAIN FIX)
# ---------------------------------------------------
def execute_ai_action(action_json):
    action = action_json.get("action")

    conn = get_db_connection()
    cursor = conn.cursor()

    if action == "add_event":

        if not action_json.get("student_id"):
            return {"error": "student_id missing"}

        event_time = normalize_time(action_json.get("event_time"))

        print("🔥 AI RAW TIME:", action_json.get("event_time"))
        print("🔥 AI FINAL TIME:", event_time)

        cursor.execute("""
            INSERT INTO calendar_events
            (student_id,title,event_date,event_time,event_type,important,created_by)
            VALUES (%s,%s,%s,%s,%s,%s,'llm')
        """,(
            action_json["student_id"],
            action_json["title"],
            action_json["event_date"],
            event_time,   # ✅ FIXED
            action_json.get("event_type","task"),
            action_json.get("important",False)
        ))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message":"AI action executed"}
