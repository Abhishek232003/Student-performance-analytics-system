def format_results(results):
    """
    Convert Pinecone query results into a clean list of videos
    """

    formatted = []

    for match in results["matches"]:

        metadata = match["metadata"]

        title = metadata.get("title", "")
        url = metadata.get("url", "")
        topic = metadata.get("topic", "")

        formatted.append({
            "title": title,
            "url": url,
            "topic": topic
        })

    return formatted