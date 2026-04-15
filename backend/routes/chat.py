import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from core.config import DEFAULT_MODEL, is_valid_model
from services.auth import get_current_user
from services.huggingface import (
    HuggingFaceAPIError,
    send_huggingface_request,
    stream_huggingface_request,
)

logger = logging.getLogger(__name__)
router = APIRouter()


class InferenceSettings(BaseModel):
    temperature: float = 0.7
    max_tokens: int = 512
    top_p: float = 0.9
    top_k: int = 50
    stream: bool = True


class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = None
    settings: InferenceSettings


def _extract_response_text(result: dict) -> str:
    choices = result.get("choices", [])
    if not choices:
        return ""

    message = choices[0].get("message", {})
    return message.get("content", "")


@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    user: dict = Depends(get_current_user),
):
    try:
        model = request.model or DEFAULT_MODEL
        model = model.strip() or DEFAULT_MODEL
        print("Model received:", model)

        if not is_valid_model(model):
            raise HTTPException(
                status_code=400,
                detail={"error": "Model not supported", "requested": model},
            )

        settings_dict = request.settings.model_dump()

        if request.settings.stream:
            return StreamingResponse(
                stream_huggingface_request(model, request.message, settings_dict),
                media_type="text/event-stream",
            )

        result = await send_huggingface_request(model, request.message, settings_dict)
        return {
            "response": _extract_response_text(result),
            "raw": result,
            "user_id": user["user_id"],
        }
    except HTTPException:
        raise
    except HuggingFaceAPIError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail={"error": e.message, "requested": model},
        ) from e
    except Exception as e:
        logger.error("Chat endpoint error: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail={"error": f"Server error: {str(e)}"}) from e
