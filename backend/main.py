from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from jamendo import buscar_musicas, buscar_musicas_populares
from usuarios import router as usuarios_router

app = FastAPI(title="Moodflow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios_router)

@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Moodflow API funcionando!"}

@app.get("/musicas/populares")
async def musicas_populares():
    musicas = await buscar_musicas_populares()
    return {"musicas": musicas}

@app.get("/musicas/buscar")
async def buscar(q: str):
    musicas = await buscar_musicas(q)
    return {"musicas": musicas}