"""
Vector Indexer for Ubuzima Hub AI System
Creates and manages vector embeddings for NISR datasets
"""

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
import os
from pathlib import Path
from data_loader import NISRDataLoader


class VectorIndexer:
    """Manages vector embeddings and similarity search"""
    
    def __init__(
        self,
        embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2",
        db_path: str = "./vectordb"
    ):
        self.embedding_model_name = embedding_model
        self.db_path = Path(db_path)
        self.db_path.mkdir(parents=True, exist_ok=True)
        
        print(f"Initializing embedding model: {embedding_model}")
        self.embedder = SentenceTransformer(embedding_model)
        
        print(f"Initializing ChromaDB at: {db_path}")
        self.client = chromadb.PersistentClient(path=str(self.db_path))
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="nisr_rwanda_data",
            metadata={"description": "NISR Rwanda nutrition and survey data"}
        )
        
    def index_documents(self, documents: List[Dict[str, Any]]) -> None:
        """Index documents with vector embeddings"""
        print(f"\nIndexing {len(documents)} documents...")
        
        # Extract texts and IDs
        texts = [doc["text"] for doc in documents]
        ids = [doc["id"] for doc in documents]
        metadatas = [doc["metadata"] for doc in documents]
        
        # Generate embeddings
        print("Generating embeddings...")
        embeddings = self.embedder.encode(texts, show_progress_bar=True).tolist()
        
        # Add to ChromaDB in batches
        batch_size = 100
        for i in range(0, len(documents), batch_size):
            end_idx = min(i + batch_size, len(documents))
            
            self.collection.add(
                embeddings=embeddings[i:end_idx],
                documents=texts[i:end_idx],
                metadatas=metadatas[i:end_idx],
                ids=ids[i:end_idx]
            )
            
            print(f"Indexed batch {i//batch_size + 1}/{(len(documents)-1)//batch_size + 1}")
            
        print(f"✓ Successfully indexed {len(documents)} documents")
        
    def search(
        self,
        query: str,
        n_results: int = 5,
        filter_metadata: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """Search for relevant documents using semantic similarity"""
        # Generate query embedding
        query_embedding = self.embedder.encode([query])[0].tolist()
        
        # Search in ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=filter_metadata if filter_metadata else None
        )
        
        # Format results
        formatted_results = []
        if results["documents"] and len(results["documents"]) > 0:
            for i in range(len(results["documents"][0])):
                formatted_results.append({
                    "id": results["ids"][0][i],
                    "text": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if "distances" in results else None
                })
                
        return formatted_results
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the indexed collection"""
        count = self.collection.count()
        
        return {
            "total_documents": count,
            "embedding_model": self.embedding_model_name,
            "collection_name": self.collection.name,
            "db_path": str(self.db_path)
        }
    
    def clear_collection(self) -> None:
        """Clear all documents from the collection"""
        print("Clearing collection...")
        self.client.delete_collection(name="nisr_rwanda_data")
        self.collection = self.client.get_or_create_collection(
            name="nisr_rwanda_data",
            metadata={"description": "NISR Rwanda nutrition and survey data"}
        )
        print("✓ Collection cleared")


def build_index():
    """Build the vector index from NISR datasets"""
    print("=== Building NISR Data Vector Index ===\n")
    
    # Load data
    loader = NISRDataLoader(data_folder="../data")
    loader.load_datasets()
    documents = loader.prepare_documents()
    
    if not documents:
        print("✗ Error: No documents to index")
        return
    
    # Create vector index
    indexer = VectorIndexer()
    
    # Clear existing data (optional - comment out to keep existing index)
    # indexer.clear_collection()
    
    # Index documents
    indexer.index_documents(documents)
    
    # Print stats
    stats = indexer.get_collection_stats()
    print("\n=== Index Statistics ===")
    for key, value in stats.items():
        print(f"{key}: {value}")
    
    # Test search
    print("\n=== Testing Search ===")
    test_query = "What is the stunting rate in Rwanda?"
    print(f"Query: {test_query}")
    results = indexer.search(test_query, n_results=3)
    
    print(f"\nTop {len(results)} results:")
    for i, result in enumerate(results, 1):
        print(f"\n{i}. {result['text'][:150]}...")
        print(f"   Source: {result['metadata']['source']}")
        
    print("\n✓ Index build complete!")


if __name__ == "__main__":
    build_index()
