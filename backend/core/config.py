from typing import Dict, List

from dotenv import load_dotenv
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    HUGGINGFACE_API_KEY: str = ""
    SUPABASE_URL: str = Field(
        "",
        validation_alias=AliasChoices("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"),
    )
    SUPABASE_ANON_KEY: str = Field(
        "",
        validation_alias=AliasChoices("SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    )
    SUPABASE_JWT_SECRET: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

# Verified against the Hugging Face router on 2026-04-16.
DEFAULT_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct"

ALLOWED_MODELS: Dict[str, List[str]] = {
    "fast": [
        "meta-llama/Llama-3.2-1B-Instruct",
        "NousResearch/Hermes-2-Pro-Llama-3-8B",
    ],
    "balanced": [
        DEFAULT_MODEL,
    ],
    "powerful": [
        "meta-llama/Meta-Llama-3-70B-Instruct",
    ],
}

ALL_MODELS: List[str] = [
    model.strip()
    for category in ALLOWED_MODELS.values()
    for model in category
]


def is_valid_model(model: str) -> bool:
    return model.strip() in ALL_MODELS
