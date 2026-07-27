from fastapi import FastAPI, Request, Response
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
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manual Preflight Bypass
@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# Include Routers
app.include_router(ai_routes.router, prefix="/api", tags=["AI Integration"])

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

@app.get("/")
def read_root():
    return {"message": "Welcome to Decision IQ AI Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
