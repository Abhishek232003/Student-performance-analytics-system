from pinecone import Pinecone
from llm.config import PINECONE_API_KEY, PINECONE_INDEX

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Connect to index
index = pc.Index(PINECONE_INDEX)


def upsert_vector(id, embedding, metadata):
    """
    Store vector in Pinecone
    """
    index.upsert(
        vectors=[
            {
                "id": id,
                "values": embedding,
                "metadata": metadata
            }
        ]
    )


def search_vector(embedding):
    """
    Query Pinecone for similar vectors
    """
    return index.query(
        vector=embedding,
        top_k=5,
        include_metadata=True
    )


def check_index_stats():
    stats = index.describe_index_stats()
    print(stats)