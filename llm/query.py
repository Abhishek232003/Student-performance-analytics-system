from llm.agents.agent_graph import build_graph

graph = build_graph()

print("\nLangGraph Agent Started (Ctrl+C to exit)\n")

while True:

    query = input("Enter your query: ")

    state = {
        "user_query": query,
        "intent": None,
        "rag_response": None,
        "action_json": None,
        "final_response": None
    }

    result = graph.invoke(state)

    print("\nFINAL RESPONSE:")
    print(result["final_response"])

    if result["action_json"]:
        print("\nACTION JSON:")
        print(result["action_json"])

    print("\n---------------------------\n")