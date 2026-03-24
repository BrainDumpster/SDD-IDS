from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate

from retrieval.retriever import DesignRetriever


class DesignRAGChain:

    def __init__(self):

        retriever = DesignRetriever().get_retriever()

        llm = Ollama(
            model="llama3",
            temperature=0
        )

        # 1. Define the System Message and Persona
        # This keeps the LLM focused on your Design System Knowledge base
        prompt = ChatPromptTemplate.from_messages([
            ("system", (
                "You are a Design System Expert. Use the given context "
                "and component tokens to answer the user's question. "
                "If the answer isn't in the context, state that you don't know.\n\n"
                "Context:\n{context}"
            )),
            ("human", "{question}"),
        ])


        # Create a chain that includes source documents
        self.chain = (
            RunnablePassthrough.assign(context=retriever)
            | RunnablePassthrough.assign(
                answer=lambda x: llm.invoke(f"Context: {x['context']}\n\nQuestion: {x['question']}\n\nAnswer:")
            )
            | (lambda x: {
                "result": x["answer"],
                "source_documents": x["context"]
            })
        )

    def query(self, question):

        return self.chain.invoke({"question": question})