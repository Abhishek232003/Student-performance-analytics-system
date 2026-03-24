import requests

BACKEND_URL = "http://localhost:5000/api/calendar/add"


def create_calendar_event(action_json):
    """
    Send calendar event to backend API
    """
    student_id = action_json.get("student_id")
    print("🔥 API STUDENT_ID:", student_id)
    print("🔥 FULL ACTION_JSON:", action_json)
    if not student_id:
        return "❌ student_id missing in API"

    payload = {
        "student_id": student_id,   # 🔥 FIXED
        "title": action_json.get("title"),
        "event_date": action_json.get("event_date"),
        "event_time": action_json.get("event_time"),
        "event_type": action_json.get("event_type"),
        "important": action_json.get("important", False),
        "description": ""
    }

    try:
        response = requests.post(BACKEND_URL, json=payload)
        print("🔥 API RESPONSE:", response.status_code, response.text)
        if response.status_code == 201:
            return "Calendar event successfully created."

        else:
            return f"Backend error: {response.text}"

    except Exception as e:
        return f"API connection failed: {str(e)}"