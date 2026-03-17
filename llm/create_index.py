from pinecone import Pinecone, ServerlessSpec
from llm.config import PINECONE_API_KEY, PINECONE_INDEX

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

index_name = PINECONE_INDEX

# Check if index already exists
existing_indexes = [index.name for index in pc.list_indexes()]

if index_name not in existing_indexes:

    pc.create_index(
        name=index_name,
        dimension=384,   # sentence-transformer dimension
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

    print(f"Index '{index_name}' created successfully.")

else:
    print(f"Index '{index_name}' already exists.")