import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# GROK
##GROK_API_KEY = os.getenv("GROK_API_KEY")##

# PINECONE
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")

# INDEX NAME
PINECONE_INDEX = "courses-index"

# EMBEDDING MODEL
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


