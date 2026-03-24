import requests


def rag_query(question):
    """Query the RAG system for design system answers"""
    try:
        r = requests.post(
            "http://localhost:8000/design/query",
            json={"question": question}
        )
        return r.json()["answer"]
    except Exception as e:
        return f"Error: {str(e)}"


def get_design_answer(question):
    """Simple interface to get design system answers"""
    return rag_query(question)


# Create a simple agent interface
class DesignAgent:
    def run(self, question):
        return get_design_answer(question)


# Create agent instance
agent = DesignAgent()