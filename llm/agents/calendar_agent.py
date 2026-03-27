from llm.llama_client import ask_llama
from llm.utils.json_parser import safe_json_parse
from llm.tools.calendar_api import create_calendar_event
from llm.utils.date_parser import normalize_date
from datetime import datetime

def calendar_agent(state):

    query = state["user_query"]

    prompt = f"""
You are a calendar action generator.

Convert the user request into a JSON action.

Allowed actions:
add_event
mark_complete

JSON format:

{{
 "action": "add_event",
 "title": "",
 "event_date": "",
 "event_time": "",
 "event_type": "",
 "important": false
}}

User request:
{query}

IMPORTANT:
Return ONLY valid JSON.
Do not include explanations.
"""

    # -------------------------
    # CALL LLM
    # -------------------------
    response = ask_llama(prompt)
    print("LLM RAW RESPONSE:", response)

    action_json = safe_json_parse(response)

    if not action_json:
        state["final_response"] = "Could not extract a valid calendar action."
        return state

    # -------------------------
    # 🔥 DATE NORMALIZATION + FORCE CURRENT YEAR
    # -------------------------
    raw_date = action_json.get("event_date")

    normalized_date = normalize_date(raw_date)

    if normalized_date:
        action_json["event_date"] = normalized_date

        try:
            parsed_date = datetime.strptime(action_json["event_date"], "%Y-%m-%d")
            today = datetime.today()

            # 🚨 FIX: if LLM gives past year (like 2023)
            if parsed_date.year < today.year:
                parsed_date = parsed_date.replace(year=today.year)

            # 🚨 FIX: if still past date → move to next year
            if parsed_date.date() < today.date():
                parsed_date = parsed_date.replace(year=parsed_date.year + 1)

            action_json["event_date"] = parsed_date.strftime("%Y-%m-%d")

        except Exception as e:
            print("DATE FIX ERROR:", e)

    # -------------------------
    # 🔥 TIME NORMALIZATION (FULLY ROBUST)
    # -------------------------
    event_time = action_json.get("event_time")

    if event_time:
        try:
            clean_time = str(event_time).strip().lower()

            # ✅ HH:MM:SS
            if len(clean_time.split(":")) == 3 and "am" not in clean_time and "pm" not in clean_time:
                parsed_time = datetime.strptime(clean_time, "%H:%M:%S")

            # ✅ 3:20 am / 5:30 pm
            elif ":" in clean_time and ("am" in clean_time or "pm" in clean_time):
                parsed_time = datetime.strptime(clean_time, "%I:%M %p")

            # ✅ 3 pm
            elif "am" in clean_time or "pm" in clean_time:
                parsed_time = datetime.strptime(clean_time, "%I %p")

            # ✅ 14:30
            elif len(clean_time.split(":")) == 2:
                parsed_time = datetime.strptime(clean_time, "%H:%M")

            else:
                parsed_time = None

            if parsed_time:
                action_json["event_time"] = parsed_time.strftime("%H:%M:%S")
            else:
                action_json["event_time"] = None

        except Exception as e:
            print("TIME PARSE ERROR:", clean_time, e)
            action_json["event_time"] = None

    else:
        action_json["event_time"] = None

    # -------------------------
    # SUBJECT DETECTION
    # -------------------------
    query_lower = query.lower()

    if "os" in query_lower:
        action_json["event_type"] = "OS"
    elif "dsa" in query_lower:
        action_json["event_type"] = "DSA"
    elif "vlsi" in query_lower:
        action_json["event_type"] = "VLSI"
    elif "robotics" in query_lower:
        action_json["event_type"] = "Robotics"
    elif "cad" in query_lower:
        action_json["event_type"] = "CAD"
    elif "dsp" in query_lower:
        action_json["event_type"] = "DSP"
    elif not action_json.get("event_type"):
        action_json["event_type"] = "general"

    # -------------------------
    # ADD STUDENT ID
    # -------------------------
    student_id = state.get("student_id")

    if not student_id:
        return {"error": "student_id missing in state"}

    action_json["student_id"] = student_id

    # -------------------------
    # DEBUG
    # -------------------------
    print("FINAL ACTION:", action_json)

    # -------------------------
    # SAVE + CALL BACKEND
    # -------------------------
    state["action_json"] = action_json

    result = create_calendar_event(action_json)

    state["final_response"] = result

    return state