import requests

def ask_llama(prompt):

    url = "http://localhost:11434/api/generate"

    data = {
        "model": "llama3",
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(url, json=data)

    result = response.json()

    # handle error safely
    if "error" in result:
        return f"LLM Error: {result['error']}"

    return result.get("response") or result.get("message") or str(result)