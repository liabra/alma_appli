from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.user import Bebe
from app.models.events import Tetee, Checkin
from app.services.ia_service import generer_encouragement
from datetime import datetime, date, timedelta
from pydantic import BaseModel

router = APIRouter(prefix="/encouragement", tags=["encouragement"])

@router.get("/{user_uuid}")
def get_encouragement(user_uuid: str, session: Session = Depends(get_session)):
    bebe = session.exec(select(Bebe).where(Bebe.user_uuid == user_uuid)).first()
    if not bebe:
        return {"message": "Tu es là pour ton bébé chaque jour. C'est remarquable. 🌿"}

    # Stats hier
    hier = date.today() - timedelta(days=1)
    tetees_hier = session.exec(
        select(Tetee).where(Tetee.bebe_id == bebe.id)
    ).all()
    nb_tetees = len([t for t in tetees_hier if t.timestamp.date() == hier])

    # Humeur 7 derniers jours
    checkins = session.exec(
        select(Checkin).where(Checkin.user_uuid == user_uuid).order_by(Checkin.timestamp.desc()).limit(7)
    ).all()
    moods = [c.mood for c in checkins]

    # Âge bébé
    age_jours = (date.today() - date.fromisoformat(bebe.date_naissance)).days

    message = generer_encouragement(
        prenom_bebe=bebe.prenom,
        age_jours=age_jours,
        nb_tetees=nb_tetees,
        mode_alimentation=bebe.mode_alimentation,
        total_sommeil="—",
        mood_7j=moods,
    )
    return {"message": message}
