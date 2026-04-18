from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # App
    app_name: str = "NachAI"
    debug: bool = False
    frontend_url: str = "http://localhost:3000"
    api_url: str = "http://localhost:8000"

    # Database
    database_url: str

    # JWT
    jwt_access_secret: str
    jwt_refresh_secret: str
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # OAuth Providers
    github_client_id: str
    github_client_secret: str
    google_client_id: str
    google_client_secret: str

    # AI Providers
    gemini_api_key: str
    gemini_model: str = "gemini-2.5-flash"


settings = Settings()
