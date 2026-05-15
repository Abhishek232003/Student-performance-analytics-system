from llm.rag_pipeline import run_rag

def rag_agent(state):

    query = state["user_query"]

    response = run_rag(query)

    state["rag_response"] = response
    state["final_response"] = response

    return state