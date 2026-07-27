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

class RiskRequest(BaseModel):
    decision: str

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

    # --- GROQ API INTEGRATION (Cloud Ready) ---
    groq_api_key = os.getenv("GROQ_API_KEY")
    groq_url = "https://api.groq.com/openai/v1/chat/completions"
    
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not found in environment")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                groq_url,
                headers={
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"User's starting point: {request.start}\nTarget goal: {request.goal}"}
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.4
                },
                timeout=180.0
            )
            
            if response.status_code != 200:
                print(f"Groq API Error: {response.text}")
                raise HTTPException(status_code=500, detail="AI engine failure")

            response_data = response.json()
            content = response_data['choices'][0]['message']['content']
            llm_json = json.loads(content)
            
    except Exception as e:
        print(f"AI API Error: {e}")
        raise HTTPException(status_code=503, detail="The AI decision engine is currently overloaded.")
    
    # Return the roadmap JSON directly to the React frontend
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

# --- Helpers for Local Risk Analysis Fallback ---
def load_decision_data():
    path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "decision-data")
    if not os.path.exists(path):
        # Fallback if run from backend folder
        path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "decision-data")
        if not os.path.exists(path):
            path = "decision-data"
            if not os.path.exists(path):
                return []
                
    content = ""
    for enc in ['utf-16-le', 'utf-8', 'latin-1']:
        try:
            with open(path, 'r', encoding=enc) as f:
                content = f.read()
            break
        except Exception:
            continue
            
    if not content:
        return []
        
    examples = []
    # Split content by "## Example"
    parts = content.split("## Example")
    for part in parts:
        if not part.strip():
            continue
        lines = part.strip().split("\n")
        
        decision = ""
        risk_level = "HIGH"
        root_cause = ""
        alternate_path = ""
        months = []
        
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            
            if line_str.startswith("**Decision:**"):
                decision = line_str.replace("**Decision:**", "").strip().strip('"').strip("'")
            elif line_str.startswith("Month "):
                parts_month = line_str.split(":", 1)
                if len(parts_month) > 1:
                    months.append(parts_month[1].strip())
                else:
                    months.append(line_str)
            elif line_str.startswith("**Risk Level:**"):
                risk_level = line_str.replace("**Risk Level:**", "").replace("  ", "").strip()
            elif line_str.startswith("**Root Cause:**"):
                root_cause = line_str.replace("**Root Cause:**", "").replace("  ", "").strip()
            elif line_str.startswith("**Alternate Path:**"):
                alternate_path = line_str.replace("**Alternate Path:**", "").replace("  ", "").strip()
                
        if decision:
            examples.append({
                "decision": decision,
                "risk_level": risk_level,
                "root_cause": root_cause,
                "alternate_path": alternate_path,
                "months": months
            })
    return examples

def find_best_match(query: str, examples: list):
    query_clean = "".join([c.lower() for c in query if c.isalnum() or c.isspace()])
    query_words = set(query_clean.split())
    best_match = None
    best_score = -1
    
    for ex in examples:
        dec_clean = "".join([c.lower() for c in ex["decision"] if c.isalnum() or c.isspace()])
        dec_words = set(dec_clean.split())
        
        overlap = query_words.intersection(dec_words)
        if len(query_words.union(dec_words)) > 0:
            score = len(overlap) / len(query_words.union(dec_words))
        else:
            score = 0
            
        if score > best_score:
            best_score = score
            best_match = ex
            
    if best_score < 0.05 and examples:
        return examples[0]
    return best_match

@router.post("/analyze-risk")
async def analyze_risk(request: RiskRequest):
    """
    Simulates career choice risk assessment using Groq LLM (if configured)
    or falls back to Jaccard-overlap matching against 200+ decision-data examples.
    """
    groq_api_key = os.getenv("GROQ_API_KEY")
    if groq_api_key:
        try:
            prompt = f"""
            You are a Career Risk Architect. Analyze the following career decision:
            "{request.decision}"
            
            Evaluate its risk level (HIGH, MEDIUM, or LOW), diagnose the root cause, simulate month-by-month trajectory for 6 months showing how it plays out, and provide a safer alternate path.
            
            Return strictly in JSON format:
            {{
              "decision": "{request.decision}",
              "risk_level": "Risk Level (HIGH/MEDIUM/LOW)",
              "root_cause": "Detailed analysis of root cause",
              "months": [
                "Month 1 simulation detail",
                "Month 2 simulation detail",
                "Month 3 simulation detail",
                "Month 4 simulation detail",
                "Month 5 simulation detail",
                "Month 6 simulation detail"
              ],
              "alternate_path": "Recommended alternate route"
            }}
            """
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {groq_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [{"role": "user", "content": prompt}],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.4
                    },
                    timeout=60.0
                )
                if response.status_code == 200:
                    data = response.json()
                    content = data['choices'][0]['message']['content']
                    return json.loads(content)
        except Exception as e:
            print(f"Groq API Error in Risk Analysis: {e}")
            
    # Local fallback
    examples = load_decision_data()
    if not examples:
        return {
            "decision": request.decision,
            "risk_level": "HIGH",
            "root_cause": "This decision lacks focus on software engineering fundamentals.",
            "months": [
                "Realize you need to study core subjects.",
                "Realize projects are essential for resume screening.",
                "Fumble in technical interviews.",
                "Receive rejections from major recruiters.",
                "Stuck with service-based placements.",
                "Begin prep from scratch to switch roles."
            ],
            "alternate_path": "Balance your preparation between coding practice and foundational projects."
        }
        
    match = find_best_match(request.decision, examples)
    if match:
        return {
            "decision": request.decision,
            "risk_level": match["risk_level"],
            "root_cause": match["root_cause"],
            "months": match["months"],
            "alternate_path": match["alternate_path"]
        }
        
    return examples[0]
