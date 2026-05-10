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
    system_prompt = f"""You are an expert career counselor. The user is at '{request.start}' and wants to reach the career goal: '{request.goal}'. 
You must generate a hierarchical learning path outlining the possible ways to achieve this goal and what to study in order.

You MUST respond ONLY in valid JSON format using the following schema. Do not include markdown formatting or conversational text.

Schema:
{{
  "role": "{request.goal}",
  "paths": [
    {{
      "path_name": "Name of the approach (e.g., The Math-Heavy Route)",
      "steps": [
        {{
          "order": 1,
          "topic": "Core Subject",
          "details": "Brief description of what to learn."
        }}
      ]
    }}
  ]
}}"""

    # --- GEMMA 3 API INTEGRATION (PLACEHOLDER) ---
    # Replace this block with your actual Gemma 3 HTTP request
    if gemma_api_key and gemma_api_key != "your_gemma_3_api_key_here":
        try:
            # Example API Call structure:
            # async with httpx.AsyncClient() as client:
            #     response = await client.post(
            #         "https://api.example.com/gemma-3/generate",
            #         headers={"Authorization": f"Bearer {gemma_api_key}"},
            #         json={"messages": [{"role": "system", "content": system_prompt}]}
            #     )
            #     data = response.json()
            #     llm_json = json.loads(data['choices'][0]['message']['content'])
            pass
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    # --- MOCK RESPONSE FOR TESTING ---
    # Since the API is a placeholder, we use a mock JSON that matches the required schema
    mock_llm_response = {
        "role": request.goal,
        "paths": [
            {
                "path_name": "Data Science to AI",
                "steps": [
                    { "order": 1, "topic": "Python & SQL", "details": "Master core programming and data querying." },
                    { "order": 2, "topic": "Statistics & Probability", "details": "Understand distributions." },
                    { "order": 3, "topic": "Machine Learning Algorithms", "details": "Scikit-learn, regressions." }
                ]
            },
            {
                "path_name": "Software Engineering to AI",
                "steps": [
                    { "order": 1, "topic": "Backend Development", "details": "Node.js, Python FastAPI." },
                    { "order": 2, "topic": "MLOps & Deployment", "details": "Docker, AWS SageMaker." },
                    { "order": 3, "topic": "LLM Integration", "details": "LangChain, RAG architectures." }
                ]
            }
        ]
    }
    
    # Transform the LLM's JSON into the hierarchical tree format required by the UI
    tree_data = transform_to_tree(request.start, request.goal, mock_llm_response)
    
    return {"tree": tree_data}


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
