from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.user import User
from pydantic import BaseModel
import random, string

router = APIRouter(prefix="/share", tags=["share"])

# Stockage en mémoire des codes de partage (en prod : Redis ou DB)
_share_codes: dict[str, str] = {}  # code -> user_uuid

class ShareRequest(BaseModel):
    user_uuid: str

class JoinRequest(BaseModel):
    user_uuid: str
    code: str

@router.post("/generate")
def generate_code(req: ShareRequest):
    """Génère un code de partage à 6 chiffres."""
    code = "".join(random.choices(string.digits, k=6))
    _share_codes[code] = req.user_uuid
    return {"code": code, "expires_in": "10 minutes"}

@router.post("/join")
def join_with_code(req: JoinRequest, session: Session = Depends(get_session)):
    """Lie deux comptes via le code de partage."""
    owner_uuid = _share_codes.get(req.code)
    if not owner_uuid:
        raise HTTPException(status_code=404, detail="Code invalide ou expiré")
    if owner_uuid == req.user_uuid:
        raise HTTPException(status_code=400, detail="Tu ne peux pas rejoindre ton propre compte")
    # Supprime le code après usage
    del _share_codes[req.code]
    return {"owner_uuid": owner_uuid, "partner_uuid": req.user_uuid, "linked": True}
