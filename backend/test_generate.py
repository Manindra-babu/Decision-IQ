import asyncio
import json
from routers.ai_routes import generate_paths, PathRequest

async def test():
    req = PathRequest(start="B.Tech CSE", goal="AI Engineer")
    try:
        res = await generate_paths(req)
        print(res)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(test())
