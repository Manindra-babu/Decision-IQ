import httpx
import asyncio
import traceback

async def test():
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post('http://127.0.0.1:11434/api/generate', json={'model': 'gemma4:latest', 'prompt': 'test', 'stream': False, 'format': 'json'})
            print(r.status_code)
            print(r.text)
    except Exception as e:
        print(f"Exception: {repr(e)}")
        traceback.print_exc()

asyncio.run(test())
