from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

db: dict = {}


class MusicaAtual(BaseModel):
    musica_id: str
    nome: str
    artista: str
    capa: Optional[str] = None


@router.put("/{username}/musica")
async def atualizar_musica(username: str, musica: MusicaAtual):
    db[username] = musica.model_dump()
    return db[username]


@router.get("/{username}/musica")
async def ver_musica(username: str):
    return db.get(username)


@router.delete("/{username}/musica")
async def parar_musica(username: str):
    db.pop(username, None)
    return {"ok": True}