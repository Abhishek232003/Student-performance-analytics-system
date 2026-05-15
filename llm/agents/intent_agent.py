from llm.llama_client import ask_llama

def intent_agent(state):

    query = state.get("user_query", "").strip()

    prompt = f"""
You are an intent classifier.

Classify the user request into ONE of these labels:

learning_query
calendar_action

learning_query:
Questions about concepts, explanations, or study materials.

calendar_action:
Requests to add, update, or manage events such as assignments or reminders.

User Query:
{query}

Return ONLY the label.
"""

    raw_intent = ask_llama(prompt).strip().casefold()

    valid_intents = {
        "learning_query": ["learning_query", "learn", "study", "explain", "concept"],
        "calendar_action": ["calendar_action", "calendar", "remind", "task", "event", "assignment"]
    }

    intent = None

    for canonical, synonyms in valid_intents.items():
        if raw_intent in synonyms or any(word in raw_intent.split() for word in synonyms):
            intent = canonical
            break

    if intent is None:
        if any(word in query.lower() for word in ["exam","assignment","remind","schedule","calendar","task"]):
            intent = "calendar_action"
        else:
            intent = "learning_query"

    state["intent"] = intent

    '''state["debug"] = {
        "query": query,
        "raw_intent": raw_intent,
        "final_intent": intent
    }'''
    
    return state