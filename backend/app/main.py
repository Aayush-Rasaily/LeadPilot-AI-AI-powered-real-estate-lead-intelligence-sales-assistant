from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes.leads import router as leads_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="LeadPilot AI",
    description="AI-powered real-estate lead intelligence platform",
    version="1.0.0"
)


from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://leadpilotai-ai-powered-real-estate-lead.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(leads_router)


@app.get("/")
def root():
    return {
        "message": "LeadPilot AI API is running",
        "status": "ok"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }