import chromadb
import re

from rag.openai_client import client

# Store vectors persistently on disk.
chroma_client = chromadb.PersistentClient(path="./chroma_db")

collection = chroma_client.get_or_create_collection(name="ipc_knowledge_base")

def create_embedding(text):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )

    return response.data[0].embedding


def add_chunks(chunks):
    for chunk in chunks:
        embedding = create_embedding(chunk["text"])

        collection.upsert(
            ids=[chunk["id"]],
            documents=[chunk["text"]],
            embeddings=[embedding],
            metadatas=[chunk["metadata"]]
        )


def search_chunks(question, top_k=5):
    query_embedding = create_embedding(question)
    print("Total chunks in ChromaDB:", collection.count())

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results

def retrieve_context(question, top_k=5):

    # Step 1: Search using semantic similarity
    results = search_chunks(question, top_k)

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    context_parts = []

    # Step 2: Extract the IPC section number from the question
    match = re.search(
        r"\b(?:(?:section|sec)\.?\s*)?(\d+[A-Za-z]?)\s*(?:IPC)?\b",
        question,
        re.IGNORECASE
    )

    if match:
        section_number = match.group(1)

        print("Requested IPC Section:", section_number)

        # Step 3: Search all stored chunks for the exact section
        all_chunks = collection.get(
            include=["documents", "metadatas"]
        )

        for document, metadata in zip(
            all_chunks["documents"],
            all_chunks["metadatas"]
        ):

            # Match section headings such as:
            # 302. Punishment for murder.
            # 302A. Example heading.
            pattern = rf"(?<!\d){re.escape(section_number)}[A-Za-z]?\.\s+"
            if re.search(pattern, document):

                print(
                    "Exact section found on page:",
                    metadata.get("page")
                )

                context_parts.append(
                    f"Source: {metadata.get('source')}, "
                    f"Page: {metadata.get('page')}\n{document}"
                )

    # Step 4: Add semantic search results
    for document, metadata in zip(documents, metadatas):

        if document not in context_parts:
            context_parts.append(
                f"Source: {metadata.get('source')}, "
                f"Page: {metadata.get('page')}\n{document}"
            )

    # Step 5: Combine the context
    context = "\n\n".join(context_parts)

    print("\nFinal context length:", len(context))

    return context