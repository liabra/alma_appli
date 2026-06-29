from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import create_db_and_tables
from app.routers import vault
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_db_and_tables()
        logger.info("✅ Base de données initialisée")
    except Exception as e:
        logger.warning(f"⚠️ DB init warning: {e}")
    yield

# PATCH SÉCURITÉ : doc d'API fermée en production
_docs_kwargs = {}
if settings.ENVIRONMENT == "production":
    _docs_kwargs = {"docs_url": None, "redoc_url": None, "openapi_url": None}

app = FastAPI(title="Alma API", version="1.1.0", lifespan=lifespan, **_docs_kwargs)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "PUT", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(vault.router)

@app.get("/health")
def health():
    return {"status": "healthy", "app": "alma"}

@app.get("/")
def root():
    return {"status": "ok", "app": "Alma API", "version": "1.1.0"}
