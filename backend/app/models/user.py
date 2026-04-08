from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    uuid: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    locale: str = Field(default="fr")
    is_paid: bool = Field(default=False)

class Bebe(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_uuid: str = Field(foreign_key="user.uuid")
    prenom: str
    date_naissance: str  # ISO date string
    mode_alimentation: str = Field(default="allait")  # allait | biberon | mixte
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Alliee(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_uuid: str = Field(foreign_key="user.uuid")
    prenom: str
    emoji: str = Field(default="👩")
    tel: str
    whatsapp: bool = Field(default=True)
    tags: str = Field(default="[]")      # JSON array
    note: str = Field(default="")
    creneaux: str = Field(default="[]")  # JSON array [{debut, fin}]

class DashboardConfig(SQLModel, table=True):
    user_uuid: str = Field(primary_key=True, foreign_key="user.uuid")
    widget_order: str = Field(default='["alimentation","soutien","couches","sommeil","sante"]')
    hidden_widgets: str = Field(default="[]")
