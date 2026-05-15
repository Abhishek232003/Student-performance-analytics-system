from sentence_transformers import SentenceTransformer
from llm.config import EMBEDDING_MODEL

model = SentenceTransformer(EMBEDDING_MODEL)

print("embedding called")

def create_embedding(text: str):
    """
    Convert text into vector embedding
    """
    return model.encode(text).tolist()