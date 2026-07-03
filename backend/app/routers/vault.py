import hashlib, secrets
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.config import settings
from app.models.vault import Vault

router = APIRouter(tags=["vault"])

def _hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

def _bearer(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")
    token = authorization[7:].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Token vide")
    return token

def get_current_vault(authorization: Optional[str] = Header(default=None),
                      session: Session = Depends(get_session)) -> Vault:
    token = _bearer(authorization)
    vault = session.exec(select(Vault).where(Vault.token_hash == _hash(token))).first()
    if not vault:
        raise HTTPException(status_code=404, detail="Coffre introuvable")
    return vault

class BlobIn(BaseModel):
    blob: str
    base_version: Optional[int] = None   # verrouillage optimiste optionnel

@router.post("/vault/init")
def init_vault(authorization: Optional[str] = Header(default=None),
               session: Session = Depends(get_session)):
    token = _bearer(authorization)
    th = _hash(token)
    existing = session.exec(select(Vault).where(Vault.token_hash == th)).first()
    if existing:
        return {"status": "exists", "version": existing.version}
    vault = Vault(id=secrets.token_urlsafe(12), token_hash=th)
    session.add(vault); session.commit()
    return {"status": "created", "version": 0}

@router.get("/vault")
def read_vault(vault: Vault = Depends(get_current_vault)):
    return {"blob": vault.blob, "version": vault.version, "updated_at": vault.updated_at}

@router.put("/vault")
def write_vault(payload: BlobIn,
                vault: Vault = Depends(get_current_vault),
                session: Session = Depends(get_session)):
    if len(payload.blob.encode("utf-8")) > settings.MAX_BLOB_BYTES:
        raise HTTPException(status_code=413, detail="Coffre trop volumineux")
    if payload.base_version is not None and payload.base_version != vault.version:
        raise HTTPException(status_code=409, detail="Version obsolete, resynchroniser")
    vault.blob = payload.blob
    vault.version += 1
    vault.updated_at = datetime.now(timezone.utc)
    session.add(vault); session.commit()
    return {"version": vault.version, "updated_at": vault.updated_at}

@router.delete("/vault")
def delete_vault(vault: Vault = Depends(get_current_vault),
                 session: Session = Depends(get_session)):
    session.delete(vault)
    session.commit()
    return {"deleted": True}
