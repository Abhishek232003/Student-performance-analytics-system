import json

def safe_json_parse(response: str):
    """
    Safely parse LLM JSON output.
    Returns dict if valid, otherwise None.
    """

    try:
        start = response.find("{")
        end = response.rfind("}") + 1

        json_str = response[start:end]

        return json.loads(json_str)

    except Exception:
        return None