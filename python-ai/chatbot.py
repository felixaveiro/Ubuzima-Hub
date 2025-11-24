"""
NISR AI Chatbot for Ubuzima Hub
Retrieval-Augmented Generation with strict Rwanda NISR dataset boundaries
"""

import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from groq import Groq
from vector_indexer import VectorIndexer
from data_loader import NISRDataLoader

# Load environment variables
load_dotenv()


class NISRAIChatbot:
    """AI Chatbot that only answers from NISR Rwanda datasets"""
    
    SYSTEM_PROMPT = """You are an AI assistant for Ubuzima Hub, specialized in Rwanda's nutrition and health data.

CRITICAL RULES:
1. You can ONLY answer questions using data from NISR (National Institute of Statistics of Rwanda) datasets
2. You have access to:
   - Rwanda nutrition indicators (stunting, wasting, anemia, breastfeeding, etc.)
   - NISR survey metadata (DHS, EICV, Agricultural surveys, etc.)
3. If a question is about Rwanda but you don't find relevant data in the context, say: "I don't have NISR data to answer that specific question. My responses are based on official NISR datasets covering nutrition indicators and survey metadata."
4. If a question is about another country or topic outside Rwanda's nutrition/health data, say: "I can only answer questions about Rwanda based on official NISR (National Institute of Statistics of Rwanda) datasets. Please ask about Rwanda's nutrition, health, or survey data."
5. Always cite the data source and year in your response
6. Be precise and factual - never make up statistics
7. If data shows ranges (low-high), include them in your answer

When answering:
- Start with the direct answer
- Cite the year and source
- Mention any relevant dimensions (age group, gender, location, wealth quintile)
- Keep responses concise but informative
"""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "llama-3.1-70b-versatile",
        temperature: float = 0.1,
        max_tokens: int = 500,
        max_context_docs: int = 5
    ):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY must be set in environment or passed as parameter")
            
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.max_context_docs = max_context_docs
        
        # Initialize Groq client
        self.client = Groq(api_key=self.api_key)
        
        # Initialize vector indexer
        self.indexer = VectorIndexer()
        
        print(f"✓ NISR AI Chatbot initialized with model: {model}")
        
    def _is_rwanda_related(self, query: str) -> bool:
        """Check if query is potentially about Rwanda"""
        rwanda_keywords = [
            "rwanda", "rwandan", "kigali", "nisr", "rwa",
            "stunting", "wasting", "nutrition", "malnutrition",
            "anemia", "breastfeeding", "dhs", "eicv", "survey"
        ]
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in rwanda_keywords)
    
    def _is_out_of_scope(self, query: str) -> bool:
        """Detect if query is clearly out of scope"""
        # Check for other countries
        other_countries = [
            "uganda", "kenya", "tanzania", "burundi", "congo",
            "usa", "america", "china", "india", "europe"
        ]
        query_lower = query.lower()
        
        # If mentions other country, it's out of scope
        if any(country in query_lower for country in other_countries):
            return True
            
        # If doesn't mention Rwanda and is general question, might be out of scope
        if not self._is_rwanda_related(query):
            general_topics = ["weather", "sports", "entertainment", "politics"]
            if any(topic in query_lower for topic in general_topics):
                return True
                
        return False
    
    def _retrieve_context(self, query: str) -> List[Dict[str, Any]]:
        """Retrieve relevant documents from vector database"""
        results = self.indexer.search(query, n_results=self.max_context_docs)
        return results
    
    def _format_context(self, documents: List[Dict[str, Any]]) -> str:
        """Format retrieved documents as context for LLM"""
        if not documents:
            return "No relevant data found in NISR datasets."
            
        context_parts = ["NISR Rwanda Data Context:\n"]
        
        for i, doc in enumerate(documents, 1):
            metadata = doc["metadata"]
            context_parts.append(
                f"\n[Document {i}]\n"
                f"Source: {metadata.get('source', 'Unknown')}\n"
                f"Year: {metadata.get('year', metadata.get('year_start', 'N/A'))}\n"
                f"Data: {doc['text']}\n"
            )
            
        return "\n".join(context_parts)
    
    def chat(self, query: str) -> Dict[str, Any]:
        """
        Process a user query and return AI response based only on NISR data
        
        Returns:
            Dict with keys: answer, sources, context_used, is_relevant
        """
        # Check if out of scope
        if self._is_out_of_scope(query):
            return {
                "answer": "I can only answer questions about Rwanda based on official NISR (National Institute of Statistics of Rwanda) datasets. Please ask about Rwanda's nutrition, health, or survey data.",
                "sources": [],
                "context_used": False,
                "is_relevant": False
            }
        
        # Retrieve relevant context
        retrieved_docs = self._retrieve_context(query)
        
        # If no relevant documents found
        if not retrieved_docs or len(retrieved_docs) == 0:
            return {
                "answer": "I don't have NISR data to answer that specific question. My responses are based on official NISR datasets covering nutrition indicators and survey metadata from Rwanda.",
                "sources": [],
                "context_used": False,
                "is_relevant": True
            }
        
        # Format context
        context = self._format_context(retrieved_docs)
        
        # Build messages for LLM
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user", "content": f"Context from NISR datasets:\n\n{context}\n\nUser Question: {query}\n\nProvide a clear, factual answer based ONLY on the context above. Cite sources and years."}
        ]
        
        # Call Groq API
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            answer = response.choices[0].message.content
            
            # Extract sources from retrieved documents
            sources = [
                {
                    "source": doc["metadata"].get("source", "Unknown"),
                    "year": doc["metadata"].get("year", doc["metadata"].get("year_start", "N/A")),
                    "type": doc["metadata"].get("type", "unknown")
                }
                for doc in retrieved_docs
            ]
            
            return {
                "answer": answer,
                "sources": sources,
                "context_used": True,
                "is_relevant": True,
                "retrieved_docs": len(retrieved_docs)
            }
            
        except Exception as e:
            return {
                "answer": f"Error processing request: {str(e)}",
                "sources": [],
                "context_used": False,
                "is_relevant": True,
                "error": str(e)
            }


def interactive_chat():
    """Run interactive chat session"""
    print("=== NISR AI Chatbot - Ubuzima Hub ===")
    print("Specialized in Rwanda nutrition and health data from NISR")
    print("Type 'quit' to exit\n")
    
    try:
        chatbot = NISRAIChatbot()
    except ValueError as e:
        print(f"Error: {e}")
        print("Please set GROQ_API_KEY in .env file")
        return
    
    while True:
        query = input("\nYour question: ").strip()
        
        if query.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break
            
        if not query:
            continue
            
        print("\nThinking...")
        result = chatbot.chat(query)
        
        print(f"\n✓ Answer:\n{result['answer']}")
        
        if result.get("sources"):
            print(f"\n📚 Sources:")
            for source in result["sources"]:
                print(f"  - {source['source']} ({source['year']})")


if __name__ == "__main__":
    # Run interactive chat
    interactive_chat()
