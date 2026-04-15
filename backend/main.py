from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, models

app = FastAPI(
    title="Optimus Backend",
    description="Inference Optimizer strict wrapper for Hugging Face APIs.",
    version="1.0.0"
)

# Aggressively permissive CORS block tailored for local NextJS dev environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Expand this securely in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect Routes
app.include_router(chat.router, tags=["Chat"])
app.include_router(models.router, tags=["Models"])

@app.get("/")
async def root():
    return {"message": "Optimus Backend Operational."}

# To run locally: uvicorn main:app --reload
