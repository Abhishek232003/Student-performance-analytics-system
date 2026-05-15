from pinecone import Pinecone
from llm.config import PINECONE_API_KEY, PINECONE_INDEX

pc = Pinecone(api_key=PINECONE_API_KEY)

pc.delete_index(PINECONE_INDEX)

print("Index deleted successfully.")