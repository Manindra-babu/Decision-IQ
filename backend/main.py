from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from routers import ai_routes

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Decision IQ AI Backend",
    description="Backend API for the Decision IQ Career Navigation System",
    version="1.0.0"
)

# Set up CORS with maximum permissiveness for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include Routers
app.include_router(ai_routes.router, prefix="/api", tags=["AI Integration"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Decision IQ AI Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
