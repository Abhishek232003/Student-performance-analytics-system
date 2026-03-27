import requests

BACKEND_URL = "http://localhost:5000/api/calendar/add"

def normalize_time(event_time):
    """
    Convert any input into MySQL TIME format HH:MM:SS
    """

    if not event_time:
        return None

    # ❌ Fix LLM garbage
    if event_time == "event_time":
        return None

    try:
        # If already string
        if isinstance(event_time, str):

            parts = event_time.strip().split(":")

            # HH:MM
            if len(parts) == 2:
                h, m = int(parts[0]), int(parts[1])
                return f"{h:02}:{m:02}:00"

            # HH:MM:SS
            elif len(parts) == 3:
                h, m, s = int(parts[0]), int(parts[1]), int(parts[2])
                return f"{h:02}:{m:02}:{s:02}"

        # anything else → ignore
        return None

    except:
        return None


def create_calendar_event(action_json):
    """
    Send calendar event to backend API
    """

    student_id = action_json.get("student_id")

    print("🔥 API STUDENT_ID:", student_id)
    print("🔥 FULL ACTION_JSON:", action_json)

    if not student_id:
        return "❌ student_id missing in API"

    # -------------------------
    # 🔥 FIXED TIME HANDLING
    # -------------------------
    raw_time = action_json.get("event_time")
    if raw_time in ["event_time", "", None]:
        event_time = None
    else:
        event_time = normalize_time(raw_time)

    # -------------------------
    # FINAL PAYLOAD
    # -------------------------
    payload = {
        "student_id": student_id,
        "title": action_json.get("title"),
        "event_date": action_json.get("event_date"),
        "event_time": event_time,   # ✅ ALWAYS VALID OR NULL
        "event_type": action_json.get("event_type", "task"),
        "important": action_json.get("important", False),
        "description": action_json.get("description", ""),
        "created_by": "llm"
    }

    print("🔥 FINAL PAYLOAD:", payload)

    try:
        response = requests.post(BACKEND_URL, json=payload)

        print("🔥 API RESPONSE:", response.status_code, response.text)

        if response.status_code == 201:
            try:
                res_json = response.json()
                event_id = res_json.get("event_id")

                if event_id:
                    action_json["event_id"] = event_id
                    print("✅ EVENT ID:", event_id)

            except Exception:
                pass

            return "✅ Event created successfully!"

        else:
            return f"❌ Backend error: {response.text}"

    except Exception as e:
        return f"❌ API connection failed: {str(e)}"