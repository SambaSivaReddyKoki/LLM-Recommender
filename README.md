# LLM-based Conversational Recommender

A conversational agent powered by GPT-4 that recommends shows and movies using retrieval-augmented generation (RAG) and maintains conversation context with Redis.

## Features

- 🎬 Personalized show/movie recommendations
- 💬 Natural language conversations
- 🔍 Retrieval-augmented generation for accurate recommendations
- ⚡ FastAPI backend with Redis caching
- 🎨 Modern Next.js frontend with Tailwind CSS
- 📊 A/B testing and analytics
- 🔒 Content safety filters
- 📈 System monitoring with Sentry + Prometheus

## Tech Stack

- **Backend**: Python, FastAPI, LangChain, Redis
- **Frontend**: Next.js, Tailwind CSS
- **AI**: OpenAI GPT-4
- **Monitoring**: Sentry, Prometheus
- **Deployment**: Docker, Kubernetes (optional)

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- Redis
- OpenAI API key

### Installation

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```
4. Create a `.env` file in both `backend` and `frontend` directories with the required environment variables (see `.env.example` files)

### Running Locally

1. Start Redis server
2. Start the backend:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Project Structure

```
llm-recommender/
├── backend/               # FastAPI application
│   ├── app/               # Main application package
│   │   ├── api/           # API routes
│   │   ├── core/          # Core functionality
│   │   ├── models/        # Database models
│   │   └── services/      # Business logic
│   ├── tests/             # Backend tests
│   └── requirements.txt    # Python dependencies
├── frontend/              # Next.js application
│   ├── components/        # React components
│   ├── pages/             # Next.js pages
│   ├── public/            # Static files
│   └── styles/            # CSS/SCSS files
└── docker/                # Docker configurations
```

## License

MIT
#   L L M - R e c o m m e n d e r  
 "# LLM-Recommender" 
