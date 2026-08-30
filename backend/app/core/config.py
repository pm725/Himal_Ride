from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import Field, EmailStr, field_validator


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "HIMAL-RIDE API"
    APP_VERSION: str = "0.1.0"
    APP_ENV: str = Field(default="development", pattern="^(development|testing|production)$")
    DEBUG: bool = Field(default=True)
    API_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = Field(..., min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str = Field(...)
    DB_POOL_SIZE: int = Field(default=10)
    DB_MAX_OVERFLOW: int = Field(default=20)
    DB_POOL_RECYCLE: int = Field(default=3600)
    
    # CORS
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:5173"])
    CORS_ALLOW_CREDENTIALS: bool = True
    
    # Rate Limiting
    RATE_LIMIT_AUTH: str = "5/hour"
    RATE_LIMIT_API: str = "100/minute"
    
    # Security Headers
    HSTS_MAX_AGE: int = 31536000
    HSTS_INCLUDE_SUBDOMAINS: bool = True
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO")
    JSON_LOGS: bool = Field(default=False)
    
    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """Ensure database URL uses async driver"""
        if v.startswith("postgresql://") and "postgresql+asyncpg://" not in v:
            return v.replace("postgresql://", "postgresql+asyncpg://")
        return v
    
    class Config:
        env_file = ".env.local"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


settings = Settings()