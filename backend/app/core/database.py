from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Normalise le préfixe "postgres://" en "postgresql://" (compat SQLAlchemy)
DATABASE_URL = settings.DATABASE_URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# connect_args pour SQLite en dev, pool_pre_ping pour PostgreSQL en prod
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True,  # Vérifie la connexion avant chaque requête
)

def create_db_and_tables():
    # Enregistre le modèle Vault auprès de SQLModel.metadata
    import app.models.vault  # noqa: F401

    # Nettoyage legacy — supprimable après le premier déploiement OK
    # Supprime les anciennes tables en clair (sync cloud non chiffrée) si présentes.
    tables = ["recoverycode", "syncdata", "checkin", "mesure", "couche", "sommeil",
              "tetee", "dashboardconfig", "alliee", "bebe", "user"]
    try:
        with engine.begin() as conn:
            for t in tables:
                conn.execute(text(f'DROP TABLE IF EXISTS "{t}" CASCADE'))
        logger.info("Nettoyage legacy effectué ✅")
    except Exception as e:
        logger.warning(f"⚠️ Nettoyage legacy ignoré: {e}")

    SQLModel.metadata.create_all(engine)
    logger.info("Tables créées ✅")

def get_session():
    with Session(engine) as session:
        yield session
