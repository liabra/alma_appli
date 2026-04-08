from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import create_db_and_tables
from app.routers import auth, bebe, checkin, encouragement, share

app = FastAPI(
    title="Alma API",
    description="Backend pour l'application Alma — maternité & post-partum",
    version="1.0.0",
)

origins = settings.CORS_ORIGINS.split(",")
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

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def root():
    return {"status": "ok", "app": "Alma API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
