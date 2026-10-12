from rag.vector_store import collection

all_chunks = collection.get(
    include=["documents", "metadatas"]
)

found = False

for document, metadata in zip(
    all_chunks["documents"],
    all_chunks["metadatas"]
):
    if "302" in document:
        print("\nPage:", metadata.get("page"))
        print("Content:", document)
        print("-" * 80)
        found = True

if not found:
    print("Section number 302 not found in stored chunks.")