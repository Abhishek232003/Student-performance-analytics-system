from llm.utils.course_search import search_courses
from llm.utils.formatter import format_results
from llm.llama_client import ask_llama
from llm.system_prompt import SYSTEM_PROMPT


def run_rag(query):

    # Step 1: search vector DB
    results = search_courses(query)

    # Step 2: format results
    videos = format_results(results)

    # Step 3: build context
    context = ""

    for v in videos:
        context += f"{v['title']} - {v['url']}\n"

    # Step 4: construct prompt with system rules
    prompt = f"""
{SYSTEM_PROMPT}

Context from learning materials:
{context}

Student Question:
{query}

Instructions:
Answer ONLY using the context above.
If the answer is not present in the context, say:
"I do not have enough information in the provided materials."

Answer:
"""

    # Step 5: call LLM
    response = ask_llama(prompt)

    return response


if __name__ == "__main__":

    print("\nRAG Chatbot Started (Press Ctrl+C to exit)\n")

    try:
        while True:

            user_query = input("Enter your query: ")

            if user_query.strip() == "":
                continue

            response = run_rag(user_query)

            print("\nLLM Response:\n")
            print(response)
            print("\n" + "-" * 50 + "\n")

    except KeyboardInterrupt:
        print("\nSession ended.")