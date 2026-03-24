from mcp.server.fastmcp import FastMCP
from rag.design_rag import DesignRAG

mcp = FastMCP("design-rag")

rag = DesignRAG()


@mcp.tool()
def query_design_knowledge(question: str) -> str:
    """Query design system knowledge base"""
    return rag.query(question)


if __name__ == "__main__":
    mcp.run()