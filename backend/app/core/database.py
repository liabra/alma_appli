from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# connect_args pour SQLite en dev, pool_pre_ping pour PostgreSQL en prod
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True,  # Vérifie la connexion avant chaque requête
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    logger.info("Tables créées ✅")

def get_session():
    with Session(engine) as session:
        yield session
