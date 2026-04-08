from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.user import User, Bebe
from app.models.sync import SyncData, RecoveryCode
from pydantic import BaseModel
from typing import Optional
import json, random, string
from datetime import datetime, timedelta

router = APIRouter(prefix="/sync", tags=["sync"])

def gen_recovery_code():
    """Génère un code ALMA-XXXX-XXXX lisible"""
    chars = string.ascii_uppercase + string.digits
    part1 = "".join(random.choices(chars, k=4))
    part2 = "".join(random.choices(chars, k=4))
    return f"ALMA-{part1}-{part2}"

class SyncPayload(BaseModel):
    uuid: str
    data: dict  # tout le state Zustand sérialisé

class RecoverRequest(BaseModel):
    recovery_code: str

@router.post("/push")
def push_sync(payload: SyncPayload, session: Session = Depends(get_session)):
    """Sauvegarde les données de l'utilisateur sur le serveur."""
    sync = session.get(SyncData, payload.uuid)
    if not sync:
        sync = SyncData(uuid=payload.uuid, data=json.dumps(payload.data))
        session.add(sync)
    else:
        sync.data = json.dumps(payload.data)
        sync.updated_at = datetime.utcnow()
    session.commit()
    return {"status": "ok", "updated_at": sync.updated_at}

@router.get("/pull/{uuid}")
def pull_sync(uuid: str, session: Session = Depends(get_session)):
    """Récupère les données de l'utilisateur."""
    sync = session.get(SyncData, uuid)
    if not sync:
        raise HTTPException(status_code=404, detail="Aucune donnée trouvée")
    return {"data": json.loads(sync.data), "updated_at": sync.updated_at}

@router.post("/recovery/generate")
def generate_recovery(uuid: str, session: Session = Depends(get_session)):
    """Génère ou récupère le code de récupération de l'utilisateur."""
    existing = session.exec(
        select(RecoveryCode).where(RecoveryCode.uuid == uuid)
    ).first()
    if existing:
        return {"code": existing.code}
    code = gen_recovery_code()
    rc = RecoveryCode(uuid=uuid, code=code)
    session.add(rc)
    session.commit()
    return {"code": code}

@router.post("/recovery/restore")
def restore_from_code(req: RecoverRequest, session: Session = Depends(get_session)):
    """Restaure un compte depuis le code de récupération."""
    rc = session.exec(
        select(RecoveryCode).where(RecoveryCode.code == req.recovery_code.upper())
    ).first()
    if not rc:
        raise HTTPException(status_code=404, detail="Code invalide ou inexistant")
    sync = session.get(SyncData, rc.uuid)
    if not sync:
        raise HTTPException(status_code=404, detail="Aucune donnée associée à ce code")
    return {
        "uuid": rc.uuid,
        "data": json.loads(sync.data),
        "updated_at": sync.updated_at
    }
