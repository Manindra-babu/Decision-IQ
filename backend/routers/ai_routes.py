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

@router.post("/generate-paths")
async def generate_paths(request: PathRequest):
    """
    Generates a hierarchical career roadmap using the Gemma 3 API.
    """
    gemma_api_key = os.getenv("GEMMA_3_API_KEY")
    
    # -------------------------------------------------------------
    # IMPORTANT: The prompt strictly dictates the JSON output format
    # -------------------------------------------------------------
    system_prompt = f"""You are an expert career architect. The user will provide a target role.
You must generate a highly detailed, multi-branching career roadmap in STRICT JSON format. 

The roadmap MUST include:
1. Multiple distinct starting paths (e.g., Math-first, Code-first).
2. Deep specialization tracks.
3. Points where different paths converge into core skills.

Constraint: Do not generate a simple line. You must generate at least 15 nodes. You must include foundational nodes that merge into a central "Core" node, which then branches out again into at least two distinct professional specializations (e.g., "Industry ML" vs "Research Lab").

Use this exact JSON schema:
{{
  "role": "{request.goal}",
  "nodes": [
    {{
      "id": "unique_string_id",
      "label": "<Main Topic Name>",
      "description": "<Specific skills (e.g., NumPy, Pandas)>",
      "track": "<Which branch this belongs to (e.g., Foundations, MLOps, Research)>",
      "depends_on": ["<id_of_prerequisite_node>"]
    }}
  ]
}}"""

    # --- OLLAMA API INTEGRATION (Direct IPv4) ---
    ollama_ip = "10.239.16.36"  # Using the direct network address
    ollama_url = f"http://{ollama_ip}:11434/api/generate"
    ollama_model = "gemma3:270m"
    
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
                timeout=60.0
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
        raise HTTPException(status_code=503, detail=f"AI Server at {ollama_ip} is currently unreachable. Make sure Ollama is running on the other PC.")
    
    # Return the DAG nodes directly to the React frontend
    return {"tree": llm_json}


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
    ollama_ip = os.getenv("OLLAMA_IP", "10.239.16.36")
    ollama_url = f"http://{ollama_ip}:11434/api/generate"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ollama_url,
                json={
                    "model": os.getenv("OLLAMA_MODEL", "gemma3:270m"),
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
