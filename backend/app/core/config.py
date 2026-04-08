from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./alma_dev.db"
    SECRET_KEY: str = "alma-dev-secret-change-in-prod"
    GEMINI_API_KEY: str = ""
    CORS_ORIGINS: str = "http://localhost:5173,https://alma.up.railway.app"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
