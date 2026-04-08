from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Tetee(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    bebe_id: int = Field(foreign_key="bebe.id")
    debut: datetime
    fin: Optional[datetime] = None
    sein: Optional[str] = None        # gauche | droit | null (biberon)
    ml: Optional[float] = None        # pour biberon
    signaux: str = Field(default="[]") # JSON array
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Sommeil(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    bebe_id: int = Field(foreign_key="bebe.id")
    debut: datetime
    fin: Optional[datetime] = None
    type: str = Field(default="sieste")  # nuit | sieste

class Couche(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    bebe_id: int = Field(foreign_key="bebe.id")
    type: str  # pipi | selle | mixte
    couleur: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Mesure(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    bebe_id: int = Field(foreign_key="bebe.id")
    type: str   # poids | taille | temperature
    valeur: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Checkin(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_uuid: str = Field(foreign_key="user.uuid")
    date: str  # YYYY-MM-DD
    mood: int  # 0-4
    texte_libre: Optional[str] = None
    score_ia: Optional[float] = None  # score calculé par Gemini
    timestamp: datetime = Field(default_factory=datetime.utcnow)
