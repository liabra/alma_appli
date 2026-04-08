from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.user import User, DashboardConfig
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

class InitRequest(BaseModel):
    uuid: str
    locale: str = "fr"

@router.post("/init")
def init_user(req: InitRequest, session: Session = Depends(get_session)):
    """Initialise ou récupère un utilisateur anonyme par UUID."""
    user = session.get(User, req.uuid)
    if not user:
        user = User(uuid=req.uuid, locale=req.locale)
        session.add(user)
        # Config dashboard par défaut
        config = DashboardConfig(user_uuid=req.uuid)
        session.add(config)
        session.commit()
        session.refresh(user)
        return {"user": user, "is_new": True}
    return {"user": user, "is_new": False}

@router.get("/me")
def get_me(uuid: str, session: Session = Depends(get_session)):
    user = session.get(User, uuid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
