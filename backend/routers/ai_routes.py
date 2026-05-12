from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import httpx
import json

router = APIRouter()

# --- Pydantic Models for Requests ---
class PathRequest(BaseModel):
    start: str
    goal: str

class ChatRequest(BaseModel):
    message: str
    context: dict = {}

# --- Helper function to transform LLM JSON to Frontend Tree ---
def transform_to_tree(start: str, goal: str, llm_data: dict) -> dict:
    """
    Transforms the LLM output into the hierarchical structure expected by the DecisionAnalyzer frontend.
    """
    tree = {
        "id": "root",
        "title": start,
        "type": "start",
        "children": []
    }
    
    paths = llm_data.get("paths", [])
    
    for i, path in enumerate(paths):
        branch = {
            "id": f"branch_{i}",
            "title": path.get("path_name", f"Path {i+1}"),
            "type": "branch",
            "children": []
        }
        
        steps = path.get("steps", [])
        # We need to nest children inside each other to create the tree sequence
        current_parent = branch
        
        for j, step in enumerate(steps):
            skill_node = {
                "id": f"skill_{i}_{j}",
                "title": step.get("topic", "Skill"),
                "type": "skill",
                "children": []
            }
            current_parent["children"].append(skill_node)
            current_parent = skill_node # Move down the tree
            
        # Finally, append the goal node
        goal_node = {
            "id": f"goal_{i}",
            "title": goal,
            "type": "goal",
            "isGoal": True
        }
        current_parent["children"].append(goal_node)
        
        tree["children"].append(branch)
        
    return tree

def clean_llm_output(raw_text: str) -> str:
    """
    Strips markdown code blocks (e.g., ```json) from the LLM output 
    to ensure it can be safely parsed as JSON.
    """
    clean_text = raw_text.replace("```json", "").replace("```", "")
    return clean_text.strip()

# --- Routes ---
# Temporary in-memory storage
saved_roadmaps = []

@router.post("/save-roadmap")
async def save_roadmap(roadmap: dict):

    saved_roadmaps.append(roadmap)

    return {
        "message": "Roadmap saved successfully"
    }
@router.get("/saved-roadmaps")
async def get_saved_roadmaps():
    return saved_roadmaps
@router.post("/generate-paths")
async def generate_paths(request: PathRequest):
    """
    Generates a hierarchical career roadmap using the Gemma 3 API.
    """
    gemma_api_key = os.getenv("GEMMA_3_API_KEY")
    
    # -------------------------------------------------------------
    # IMPORTANT: The prompt strictly dictates the JSON output format
    # -------------------------------------------------------------
    system_prompt = f"""
You are an expert career roadmap architect.

Generate a structured learning roadmap in STRICT JSON format.

Rules:
1. Organize the roadmap into stages.
2. Each stage must contain multiple topics.
3. Each topic can contain subtopics.
4. Keep the roadmap beginner-friendly and visually organized.
5. Do NOT generate graph nodes or dependency structures.
6. Return ONLY valid JSON.

Use this exact schema:

{{
  "role": "{request.goal}",
  "stages": [
    {{
      "title": "Stage Name",
      "topics": [
        {{
          "name": "Topic Name",
          "description": "Short explanation",
          "subtopics": [
            "Subtopic 1",
            "Subtopic 2"
          ]
        }}
      ]
    }}
  ]
}}
"""

    # --- OLLAMA API INTEGRATION (Direct IPv4) ---
    ollama_ip = os.getenv("OLLAMA_IP", "127.0.0.1")
    ollama_url = f"http://{ollama_ip}:11434/api/generate"
    ollama_model = os.getenv("OLLAMA_MODEL", "gemma4:latest")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ollama_url,
                json={
                    "model": ollama_model,
                    "prompt": system_prompt + f"\n\nUser's starting point: {request.start}\nTarget goal: {request.goal}",
                    "stream": False,
                    "format": "json"
                },
                timeout=180.0
            )
            response.raise_for_status()
            data = response.json()
            
            # Ollama returns the generated response in the "response" field
            llm_response_text = data.get("response", "{}")
            cleaned_text = clean_llm_output(llm_response_text)
            llm_json = json.loads(cleaned_text)
            
    except Exception as e:
        print(f"Ollama API Error: {e}")
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=f"AI Server at {ollama_ip} is currently unreachable.")
    
    # Return the DAG nodes directly to the React frontend
    return llm_json


@router.post("/assistant")
async def ai_assistant(request: ChatRequest):
    """
    Handles AI assistant chats using your Custom Trained LLM.
    """
    custom_llm_key = os.getenv("CUSTOM_LLM_API_KEY")
    
    # --- CUSTOM LLM API INTEGRATION (PLACEHOLDER) ---
    if custom_llm_key and custom_llm_key != "your_custom_llm_api_key_here":
        pass
        
    return {
        "reply": f"This is a placeholder reply from your Custom LLM. I received: {request.message}"
    }

@router.get("/test-ai")
async def test_ai_connection():
    """
    A ping test to verify the backend can successfully talk to the AI Server PC.
    """
    ollama_ip = os.getenv("OLLAMA_IP", "127.0.0.1")
    ollama_url = f"http://{ollama_ip}:11434/api/generate"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ollama_url,
                json={
                    "model": os.getenv("OLLAMA_MODEL", "gemma4:latest"),
                    "prompt": "Say 'Connection Successful!' in JSON format: {\"status\": \"Connection Successful!\"}",
                    "stream": False,
                    "format": "json"
                },
                timeout=15.0
            )
            response.raise_for_status()
            data = response.json()
            
            # Clean and parse
            raw_text = data.get("response", "{}")
            cleaned_text = clean_llm_output(raw_text)
            parsed_json = json.loads(cleaned_text)
            
            return {"message": "Success!", "aiResponse": parsed_json}
    except Exception as e:
        return {"message": "Connection failed", "error": str(e)}
