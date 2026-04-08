from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.events import Checkin
from app.services.ia_service import analyser_checkin
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter(prefix="/checkin", tags=["checkin"])

class CheckinCreate(BaseModel):
    user_uuid: str
    mood: int  # 0-4
    texte_libre: Optional[str] = None

@router.post("/")
def create_checkin(data: CheckinCreate, session: Session = Depends(get_session)):
    # Récupère historique des 7 derniers jours
    checkins_recents = session.exec(
        select(Checkin).where(Checkin.user_uuid == data.user_uuid).order_by(Checkin.timestamp.desc()).limit(7)
    ).all()
    historique = [c.mood for c in checkins_recents]

    # Analyse IA
    analyse = analyser_checkin(data.texte_libre, data.mood, historique)

    checkin = Checkin(
        user_uuid=data.user_uuid,
        date=str(date.today()),
        mood=data.mood,
        texte_libre=data.texte_libre,
        score_ia=analyse.get("score"),
    )
    session.add(checkin)
    session.commit()
    session.refresh(checkin)
    return { "checkin": checkin, "analyse": analyse }

@router.get("/{user_uuid}")
def get_checkins(user_uuid: str, limit: int = 14, session: Session = Depends(get_session)):
    checkins = session.exec(
        select(Checkin).where(Checkin.user_uuid == user_uuid).order_by(Checkin.timestamp.desc()).limit(limit)
    ).all()
    return checkins
