import httpx
import asyncio

async def test():
    try:
        async with httpx.AsyncClient() as client:
            r = await client.post('http://10.239.16.36:11434/api/generate', json={'model': 'gemma:3', 'prompt': 'test', 'stream': False, 'format': 'json'})
            print(r.status_code)
            print(r.text)
    except Exception as e:
        print(f"Exception: {e}")

asyncio.run(test())
