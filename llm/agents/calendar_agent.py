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

Subject mapping rules:

If the request contains "OS" → event_type = "OS"
If the request contains "DSA" → event_type = "DSA"
If the request contains "VLSI" → event_type = "VLSI"
If the request contains "Robotics" → event_type = "Robotics"
If the request contains "CAD" → event_type = "CAD"
If the request contains "DSP" → event_type = "DSP"
If no subject is mentioned → event_type = "general"

User request:
{query}

IMPORTANT:
Return ONLY valid JSON.
Do not include explanations.
"""

    # Call LLM
    response = ask_llama(prompt)

    # Debug output
    print("LLM RAW RESPONSE:", response)

    # Extract JSON safely
    action_json = safe_json_parse(response)

    if action_json:

        # -------------------------
        # DATE NORMALIZATION
        # -------------------------
        normalized_date = normalize_date(action_json.get("event_date"))

        if normalized_date:
            action_json["event_date"] = normalized_date

        # -------------------------
        # TIME NORMALIZATION
        # -------------------------
        event_time = action_json.get("event_time")

        if event_time:
            try:
                # Handle "6pm"
                parsed_time = datetime.strptime(event_time.strip().lower(), "%I%p")
                action_json["event_time"] = parsed_time.strftime("%H:%M:%S")

            except ValueError:
                try:
                    # Handle "6:30pm"
                    parsed_time = datetime.strptime(event_time.strip().lower(), "%I:%M%p")
                    action_json["event_time"] = parsed_time.strftime("%H:%M:%S")

                except ValueError:
                    try:
                        parsed_time = datetime.strptime(event_time.strip(), "%I:%M %p")
                        action_json["event_time"] = parsed_time.strftime("%H:%M:%S")
                    
                    except ValueError:
                        # If already correct, leave it
                        pass

        # -------------------------
        # SUBJECT DETECTION (fallback)
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

        # Save action in graph state
        state["action_json"] = action_json

        # Call backend API
        result = create_calendar_event(action_json)

        state["final_response"] = result

    else:
        state["final_response"] = "Could not extract a valid calendar action."

    return state