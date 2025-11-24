"""
FastAPI Server for NISR AI Chatbot
REST API endpoint for integration with Next.js frontend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
from chatbot import NISRAIChatbot

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="NISR AI API - Ubuzima Hub",
    description="AI-powered insights based on NISR Rwanda datasets",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chatbot (lazy loading)
chatbot: Optional[NISRAIChatbot] = None


def get_chatbot() -> NISRAIChatbot:
    """Get or initialize chatbot instance"""
    global chatbot
    if chatbot is None:
        chatbot = NISRAIChatbot()
    return chatbot


# Request/Response models
class ChatRequest(BaseModel):
    """Chat request model"""
    query: str = Field(..., min_length=1, max_length=1000, description="User question")
    max_context_docs: Optional[int] = Field(5, ge=1, le=10, description="Max context documents")


class Source(BaseModel):
    """Data source model"""
    source: str
    year: str
    type: str


class ChatResponse(BaseModel):
    """Chat response model"""
    answer: str
    sources: List[Source]
    context_used: bool
    is_relevant: bool
    retrieved_docs: Optional[int] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str


# API Endpoints
@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint"""
    return {
        "status": "ok",
        "message": "NISR AI API - Ubuzima Hub is running"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        bot = get_chatbot()
        return {
            "status": "healthy",
            "message": "API is operational and chatbot initialized"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint - Ask questions about Rwanda NISR data
    
    Example request:
    ```json
    {
        "query": "What is the stunting rate in Rwanda?",
        "max_context_docs": 5
    }
    ```
    """
    try:
        bot = get_chatbot()
        
        # Override max_context_docs if provided
        if request.max_context_docs:
            bot.max_context_docs = request.max_context_docs
        
        # Get response
        result = bot.chat(request.query)
        
        return ChatResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.get("/stats")
async def get_stats():
    """Get statistics about indexed data"""
    try:
        bot = get_chatbot()
        stats = bot.indexer.get_collection_stats()
        return {
            "status": "ok",
            "data": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stats error: {str(e)}")


# Run with: uvicorn api_server:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", "8000"))
    
    print(f"\n=== Starting NISR AI API Server ===")
    print(f"Server will run on: http://localhost:{port}")
    print(f"API docs: http://localhost:{port}/docs")
    print(f"Health check: http://localhost:{port}/health\n")
    
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
