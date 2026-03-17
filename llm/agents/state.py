from typing import TypedDict, Optional, Dict

class AgentState(TypedDict):
    user_query: str
    intent: Optional[str]
    rag_response: Optional[str]
    action_json: Optional[Dict]
    final_response: Optional[str]