from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import redis
import json
import logging
from datetime import timedelta

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables
from dotenv import load_dotenv
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="LLM Recommender API",
    description="API for LLM-based Conversational Recommender",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Redis client
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    db=0,
    decode_responses=True
)

# Models
class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ConversationRequest(BaseModel):
    messages: List[Message]
    session_id: Optional[str] = None
    ab_test_group: Optional[str] = None

class RecommendationResponse(BaseModel):
    response: str
    recommendations: List[Dict[str, Any]]
    session_id: str

# Services
class RecommendationService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_api_key:
            logger.warning("OPENAI_API_KEY not found in environment variables")
    
    async def generate_recommendation(self, messages: List[Message], session_id: str) -> RecommendationResponse:
        # TODO: Implement actual recommendation logic with LangChain and OpenAI
        # This is a placeholder implementation
        return RecommendationResponse(
            response="Here are some recommendations based on your preferences...",
            recommendations=[
                {"title": "Inception", "year": 2010, "genre": "Sci-Fi", "rating": 8.8},
                {"title": "The Shawshank Redemption", "year": 1994, "genre": "Drama", "rating": 9.3},
            ],
            session_id=session_id
        )

# Initialize services
recommendation_service = RecommendationService()

# API Endpoints
@app.post("/api/conversation", response_model=RecommendationResponse)
async def converse(request: ConversationRequest):
    try:
        session_id = request.session_id or str(uuid.uuid4())
        
        # Store conversation in Redis with TTL (1 hour)
        redis_key = f"conversation:{session_id}"
        conversation = [msg.dict() for msg in request.messages]
        redis_client.setex(redis_key, timedelta(hours=1), json.dumps(conversation))
        
        # Generate response
        response = await recommendation_service.generate_recommendation(
            request.messages, session_id
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error in conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Prometheus metrics
from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app)

# Sentry integration
import sentry_sdk
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN", ""),
    traces_sample_rate=1.0,
    environment=os.getenv("ENVIRONMENT", "development"),
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
