import pymupdf


def extract_text_from_pdf(pdf_path):
    pages = []

    with pymupdf.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf):
            text = page.get_text("text")

            if text.strip():
                pages.append({
                    "page": page_number + 1,
                    "text": text
                })

    return pages