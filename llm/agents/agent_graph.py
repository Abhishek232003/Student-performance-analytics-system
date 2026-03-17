from langgraph.graph import StateGraph, END

from llm.agents.state import AgentState
from llm.agents.intent_agent import intent_agent
from llm.agents.rag_agent import rag_agent
from llm.agents.calendar_agent import calendar_agent


def route_intent(state):
    print("Detected intent:", state["intent"])

    if state["intent"] == "learning_query":
        return "rag_agent"

    if state["intent"] == "calendar_action":
        return "calendar_agent"
    
    

    else:
        return END
    
    


def build_graph():

    workflow = StateGraph(AgentState)

    workflow.add_node("intent_agent", intent_agent)
    workflow.add_node("rag_agent", rag_agent)
    workflow.add_node("calendar_agent", calendar_agent)

    workflow.set_entry_point("intent_agent")

    workflow.add_conditional_edges(
        "intent_agent",
        route_intent,
        {
            "rag_agent": "rag_agent",
            "calendar_agent": "calendar_agent"
        }
    )

    workflow.add_edge("rag_agent", END)
    workflow.add_edge("calendar_agent", END)


    return workflow.compile()