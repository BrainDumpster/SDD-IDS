from retrieval.design_retriever import DesignRetriever
from rag.component_detector import ComponentDetector
from langchain_community.llms import Ollama


class DesignRAG:

    def __init__(self, collection_name=None):

        self.retriever = DesignRetriever(collection_name=collection_name)
        self.detector = ComponentDetector()

        self.llm = Ollama(
            model="llama3",
            temperature=0.1
        )

    def query(self, question: str):

        component = self.detector.detect(question)

        docs = self.retriever.search(
            query=question,
            component=component
        )

        context = "\n\n".join([d.page_content for d in docs])

        prompt = f"""
You are a Design System Expert.

Answer using ONLY the provided context.

Component: {component or "general"}

Context:
{context}

Question:
{question}
"""

        return self.llm.invoke(prompt)

    def generate_answer(self, question: str, docs):

        context = "\n\n".join([d.page_content for d in docs])

        prompt = f"""
You are a Design System Expert.

Answer using ONLY the provided context.

Provide response and tone that matches the design system's personality.
Return only the answer, no additional text.

Summarize key points concisely.

Context:
{context}

Question:
{question}
"""

        return self.llm.invoke(prompt)