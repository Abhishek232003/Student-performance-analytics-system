from llm.vector_store import search_vector
from llm.embeddings import create_embedding

def search_courses(query):
    """
    Convert query to embedding and search Pinecone
    """

    # Convert text → embedding
    embedding = create_embedding(query)

    # Query Pinecone
    results = search_vector(embedding)

    return results