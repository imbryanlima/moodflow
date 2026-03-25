import httpx
import os

JAMENDO_CLIENT_ID = os.getenv("JAMENDO_CLIENT_ID")
JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0"

async def buscar_musicas(query: str, limite: int = 20):
    url = f"{JAMENDO_BASE_URL}/tracks"
    params = {
        "client_id": JAMENDO_CLIENT_ID,
        "format": "json",
        "limit": limite,
        "search": query,
        "audioformat": "mp32",
        "include": "musicinfo",
        "imagesize": "500",
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
        return data.get("results", [])

async def buscar_musicas_populares(limite: int = 20):
    url = f"{JAMENDO_BASE_URL}/tracks"
    params = {
        "client_id": JAMENDO_CLIENT_ID,
        "format": "json",
        "limit": limite,
        "order": "popularity_total",
        "audioformat": "mp32",
        "include": "musicinfo",
        "imagesize": "500",
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
        return data.get("results", [])