from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import create_db_and_tables
from app.routers import auth, bebe, checkin, encouragement, share
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — DB non bloquante
    try:
        create_db_and_tables()
        logger.info("✅ Base de données initialisée")
    except Exception as e:
        logger.warning(f"⚠️ DB init warning (non fatal): {e}")
    yield
    # Shutdown
    logger.info("Alma API arrêtée")

app = FastAPI(
    title="Alma API",
    description="Backend Alma — maternité & post-partum",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(bebe.router)
app.include_router(checkin.router)
app.include_router(encouragement.router)
app.include_router(share.router)

# Health check — répond TOUJOURS, même si DB non disponible
@app.get("/health")
def health():
    return {"status": "healthy", "app": "alma"}

@app.get("/")
def root():
    return {"status": "ok", "app": "Alma API", "version": "1.0.0"}
