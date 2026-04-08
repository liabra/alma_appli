from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class SyncData(SQLModel, table=True):
    uuid: str = Field(primary_key=True)
    data: str = Field(default="{}")  # JSON sérialisé
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RecoveryCode(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uuid: str = Field(index=True, unique=True)
    code: str = Field(index=True, unique=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
