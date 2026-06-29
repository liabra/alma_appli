from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

def _now():
    return datetime.now(timezone.utc)

class Vault(SQLModel, table=True):
    id: str = Field(primary_key=True)
    token_hash: str = Field(index=True, unique=True)
    blob: str = Field(default="")          # base64 du chiffré, opaque pour le serveur
    version: int = Field(default=0)
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)
