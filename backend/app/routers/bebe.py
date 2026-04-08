from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.user import Bebe
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/bebe", tags=["bebe"])

class BebeCreate(BaseModel):
    user_uuid: str
    prenom: str
    date_naissance: str
    mode_alimentation: str = "allait"

class BebeUpdate(BaseModel):
    prenom: Optional[str] = None
    mode_alimentation: Optional[str] = None

@router.post("/")
def create_bebe(data: BebeCreate, session: Session = Depends(get_session)):
    bebe = Bebe(**data.dict())
    session.add(bebe)
    session.commit()
    session.refresh(bebe)
    return bebe

@router.get("/{user_uuid}")
def get_bebe(user_uuid: str, session: Session = Depends(get_session)):
    bebe = session.exec(select(Bebe).where(Bebe.user_uuid == user_uuid)).first()
    if not bebe:
        raise HTTPException(status_code=404, detail="Bébé non trouvé")
    return bebe

@router.patch("/{bebe_id}")
def update_bebe(bebe_id: int, data: BebeUpdate, session: Session = Depends(get_session)):
    bebe = session.get(Bebe, bebe_id)
    if not bebe:
        raise HTTPException(status_code=404, detail="Bébé non trouvé")
    for k, v in data.dict(exclude_none=True).items():
        setattr(bebe, k, v)
    session.commit()
    session.refresh(bebe)
    return bebe
