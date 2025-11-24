# NISR AI System for Ubuzima Hub

**AI-Powered Question Answering System** for Rwanda nutrition and health data from NISR (National Institute of Statistics of Rwanda).

## 🎯 Overview

This Python-based AI system provides **strict, data-grounded answers** using Retrieval-Augmented Generation (RAG). It:

- ✅ Only answers questions about **Rwanda** using **official NISR datasets**
- ✅ Uses vector embeddings for semantic search across nutrition indicators and survey metadata
- ✅ Rejects out-of-scope questions with clear boundaries
- ✅ Cites sources and years in every response
- ✅ Provides REST API for Next.js frontend integration

## 📊 Data Sources

The system indexes and searches:

1. **Nutrition Indicators CSV** (6,634 rows)
   - Stunting, wasting, anemia prevalence
   - Breastfeeding practices
   - Micronutrient deficiencies
   - Age/gender/location breakdowns
   - Years: 1992-2020

2. **NISR Survey Metadata CSV** (74 surveys)
   - DHS (Demographic and Health Surveys)
   - EICV (Household Living Conditions)
   - Agricultural surveys
   - Food security assessments

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.9 or higher
- pip package manager
- Groq API key ([Get one free](https://console.groq.com/))

### 2. Installation

```powershell
# Navigate to the python-ai folder
cd python-ai

# Create virtual environment (recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration

```powershell
# Copy environment template
cp .env.example .env

# Edit .env and add your Groq API key
# Use notepad or any text editor
notepad .env
```

Add this line to `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Build Vector Index

```powershell
# Index the NISR datasets (one-time setup)
python vector_indexer.py
```

This will:
- Load CSV files from `../data/` folder
- Generate vector embeddings
- Store in ChromaDB (`./vectordb/`)
- Takes ~2-5 minutes

### 5. Run the System

#### Option A: Interactive Chat (Terminal)

```powershell
python chatbot.py
```

Example session:
```
Your question: What is the stunting rate in Rwanda?
✓ Answer: According to NISR data from 2020, the stunting prevalence 
among children under 5 years of age in Rwanda was 33.1% [31.6-34.7]...
📚 Sources: NISR Nutrition Indicators (2020)

Your question: quit
```

#### Option B: REST API Server

```powershell
python api_server.py
```

Server runs on `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

## 📡 API Usage

### POST /chat

**Request:**
```json
{
  "query": "What is the prevalence of anemia in Rwanda?",
  "max_context_docs": 5
}
```

**Response:**
```json
{
  "answer": "According to NISR data from 2019, the prevalence of anaemia in children aged 6-59 months in Rwanda was 36.0% [28.7-43.3]...",
  "sources": [
    {
      "source": "NISR Nutrition Indicators",
      "year": "2019",
      "type": "nutrition_data"
    }
  ],
  "context_used": true,
  "is_relevant": true,
  "retrieved_docs": 5
}
```

### Example cURL:

```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"query": "What surveys has NISR conducted?"}'
```

### Example JavaScript (Next.js):

```javascript
const response = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'What is the stunting rate in Rwanda?',
    max_context_docs: 5
  })
});

const data = await response.json();
console.log(data.answer);
console.log(data.sources);
```

## 🧪 Testing

Run comprehensive test suite:

```powershell
python test_chatbot.py
```

Tests cover:
- ✅ Valid Rwanda nutrition questions
- ✅ Survey metadata queries
- ✅ Out-of-scope rejection (other countries)
- ✅ Out-of-scope rejection (unrelated topics)
- ✅ Edge cases (questions with no data)

## 🏗️ Architecture

```
python-ai/
├── data_loader.py         # CSV loading and document preparation
├── vector_indexer.py      # Embedding generation and ChromaDB indexing
├── chatbot.py            # RAG chatbot with strict boundaries
├── api_server.py         # FastAPI REST server
├── test_chatbot.py       # Test suite
├── requirements.txt      # Python dependencies
├── .env.example         # Environment template
└── vectordb/            # ChromaDB storage (generated)
```

### Data Flow

1. **Indexing** (one-time):
   ```
   CSV files → data_loader → documents → embeddings → ChromaDB
   ```

2. **Query Processing**:
   ```
   User query → vector search → retrieve top-K docs → 
   format context → LLM (Groq) → answer with citations
   ```

## 🔒 Strict Boundaries

The AI system enforces these rules:

### ✅ Will Answer:
- "What is the stunting rate in Rwanda?"
- "What surveys has NISR conducted?"
- "Prevalence of anemia in Rwandan women"
- "Breastfeeding practices by region"

### ❌ Will Reject:
- Questions about other countries: *"What is stunting in Kenya?"*
  - Response: *"I can only answer questions about Rwanda based on official NISR datasets..."*
  
- General topics: *"What's the weather in Kigali?"*
  - Response: *"I can only answer questions about Rwanda based on official NISR datasets..."*
  
- Rwanda topics without data: *"What is Rwanda's GDP?"*
  - Response: *"I don't have NISR data to answer that specific question..."*

## 🔧 Configuration Options

Edit `.env` to customize:

```env
# API Keys
GROQ_API_KEY=your_key_here

# Model settings
AI_MODEL=llama-3.1-70b-versatile    # Groq model
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Behavior
MAX_CONTEXT_DOCS=5        # Documents retrieved per query
TEMPERATURE=0.1           # LLM temperature (0.0-1.0)
MAX_TOKENS=500           # Max response length
STRICT_MODE=true         # Enforce strict boundaries
```

## 📦 Dependencies

Core libraries:
- **sentence-transformers**: Embedding generation
- **chromadb**: Vector database
- **groq**: LLM API client
- **fastapi**: REST API server
- **pandas**: Data processing

See `requirements.txt` for full list.

## 🔄 Updating Data

To reindex after adding new CSV files:

```powershell
# Clear existing index and rebuild
python vector_indexer.py
```

Or programmatically:
```python
from vector_indexer import VectorIndexer

indexer = VectorIndexer()
indexer.clear_collection()  # Clear old data
# ... then rebuild
```

## 🚀 Integration with Next.js

### Step 1: Start Python API

```powershell
cd python-ai
python api_server.py
```

### Step 2: Create Next.js API Route

`app/api/nisr-ai/route.ts`:
```typescript
export async function POST(request: Request) {
  const { query } = await request.json();
  
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, max_context_docs: 5 })
  });
  
  const data = await response.json();
  return Response.json(data);
}
```

### Step 3: Use in Frontend

```typescript
const askNISR = async (question: string) => {
  const res = await fetch('/api/nisr-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: question })
  });
  
  const data = await res.json();
  console.log(data.answer);
  console.log(data.sources);
};
```

## 🐛 Troubleshooting

### Issue: "GROQ_API_KEY must be set"
**Solution:** Create `.env` file and add your API key

### Issue: "No module named 'sentence_transformers'"
**Solution:** Install dependencies: `pip install -r requirements.txt`

### Issue: "No relevant data found"
**Solution:** Build index first: `python vector_indexer.py`

### Issue: ChromaDB errors
**Solution:** Delete `vectordb/` folder and rebuild index

### Issue: CORS errors in browser
**Solution:** Add your frontend URL to `allow_origins` in `api_server.py`

## 📈 Performance

- **Index build time**: ~2-5 minutes (6,700+ documents)
- **Query latency**: ~1-3 seconds
- **Embedding model size**: ~80 MB
- **Index storage**: ~50 MB (ChromaDB)

## 🔐 Security Notes

- Never commit `.env` file with API keys
- Use environment variables in production
- Add rate limiting for public APIs
- Validate user input before processing

## 📞 Support

For issues or questions:
- **GitHub Issues**: [Ubuzima-Hub/issues](https://github.com/felixaveiro/Ubuzima-Hub/issues)
- **Email**: bikofelix2020@gmail.com

## 📜 License

MIT License - see main project LICENSE file

## 🙏 Acknowledgments

- **NISR (National Institute of Statistics of Rwanda)** - Data source
- **Groq** - LLM API provider
- **ChromaDB** - Vector database
- **sentence-transformers** - Embedding models

---

**Built for Rwanda's 2025 Big Data Hackathon** | **Track 2: Ending Hidden Hunger** 🇷🇼
