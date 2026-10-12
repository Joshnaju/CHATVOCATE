from rag.pdf_processor import extract_text_from_pdf

pdf_path = "data/IPC_186045.pdf"

pages = extract_text_from_pdf(pdf_path) #method to extract text from pdf file

print("Total pages with text:", len(pages))

print("\nFirst page text:\n")
print(pages[0]["text"])