from fastapi import APIRouter, Depends

from backend.core.config import ALLOWED_MODELS
from backend.services.auth import get_current_user

router = APIRouter()


@router.get("/models")
async def get_models(user: dict = Depends(get_current_user)):
    """
    Returns the explicitly supported/whitelisted models categorized logically.
    Used by the frontend to render Compare page stats dynamically.
    """
    return ALLOWED_MODELS
