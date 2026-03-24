from langchain_core.documents import Document

def build_chunks(component, sections, source):

    docs = []

    for s in sections:

        content = s["content"]

        metadata = {
            "component": component,
            "section": s["section"],
            "subsection": s["subsection"],
            "source": source
        }

        doc = Document(
            page_content=content,
            metadata=metadata
        )

        docs.append(doc)

    return docs