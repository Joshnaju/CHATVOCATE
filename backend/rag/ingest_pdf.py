# Create the PDF ingestion script

# We now have three components:

# PDF extraction
# Text chunking
# Vector storage

# Let's connect them

from rag.pdf_processor import extract_text_from_pdf
from rag.chunking import chunk_text
from rag.vector_store import add_chunks

PDF_PATH = "data/IPC_186045.pdf"

def ingest_pdf():
    pages = extract_text_from_pdf(PDF_PATH)

    all_chunks = []

    chunk_id = 0

    for page in pages:
        text_chunks = chunk_text(page["text"])

        for text in text_chunks:
            all_chunks.append({
                "id": f"ipc_chunk_{chunk_id}",

                "text": text,

                "metadata": {
                    "source": "IPC_186045.pdf",
                    "page": page["page"]
                }
            })

            chunk_id += 1

    add_chunks(all_chunks)

    print("PDF ingestion completed.")
    print("Total chunks:", len(all_chunks))


if __name__ == "__main__":
    ingest_pdf()

# python -m rag.ingest_pdf