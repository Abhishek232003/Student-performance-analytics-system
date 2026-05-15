import json
from llm.embeddings import create_embedding
from llm.vector_store import upsert_vector


def ingest_courses():

    with open("llm/dataset/courses.json") as f:
        courses = json.load(f)

    print("Loaded courses:", len(courses))

    for i, course in enumerate(courses):

        text = course["title"] + " " + course["description"]

        embedding = create_embedding(text)

        metadata = {
            "title": course["title"],
            "url": course["url"],
            "topic": course["topic"],
            "thumbnail": course["thumbnail"]
        }

        upsert_vector(
            id=str(i),
            embedding=embedding,
            metadata=metadata
        )

    print("Courses successfully indexed into Pinecone")



if __name__ == "__main__":
    ingest_courses()