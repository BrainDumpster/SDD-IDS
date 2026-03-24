from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

from rag.design_rag import DesignRAG
from retrieval.design_retriever import DesignRetriever


app = FastAPI(
    title="Design Intelligence RAG API",
    version="2.0"
)

rag = DesignRAG()
retriever = DesignRetriever()


# -------- Request Model --------

class QueryRequest(BaseModel):
    question: str
    component: Optional[str] = None
    section: Optional[str] = None
    doc_type: Optional[str] = None
    top_k: int = 8


# -------- Response Model --------

class SourceItem(BaseModel):
    component: Optional[str]
    section: Optional[str]
    source: Optional[str]
    snippet: str


class RelatedLink(BaseModel):
    title: str
    url: str


class QueryResponse(BaseModel):
    answer: str
    detected_component: Optional[str]
    sources: List[SourceItem]
    related_links: List[RelatedLink]


# -------- Endpoint --------

@app.post("/design/query")
def design_query(request: QueryRequest):

    # If caller already knows component, skip detection
    component = request.component

    if not component:
        component = rag.detector.detect(request.question)

    docs = retriever.search(
        query=request.question,
        component=component,
        section=request.section,
        doc_type=request.doc_type,
        top_k=request.top_k
    )

    answer = rag.generate_answer(request.question, docs)
    
    # Extract sources with metadata
    sources = [
        SourceItem(
            component=d.metadata.get("component"),
            section=d.metadata.get("section"),
            source=d.metadata.get("source"),
            snippet=d.page_content[:300]
        )
        for d in docs
    ]
    
    # Generate related links from source metadata
    related_links = []
    for d in docs:
        source_path = d.metadata.get("source")
        if source_path:
            # Keep original source path format
            title = source_path.split("/")[-1].replace("-", " ").title()
            
            related_links.append(RelatedLink(
                title=title,
                url=source_path  # Keep original path
            ))
    
    # Remove duplicate links
    seen_urls = set()
    unique_links = []
    for link in related_links:
        if link.url not in seen_urls:
            seen_urls.add(link.url)
            unique_links.append(link)

    return QueryResponse(
        answer=answer,
        detected_component=component,
        sources=sources,
        related_links=unique_links
    )