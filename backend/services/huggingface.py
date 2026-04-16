import json
import logging
from typing import Any, AsyncGenerator

import httpx

from backend.core.config import settings

logger = logging.getLogger(__name__)

CHAT_COMPLETIONS_URL = "https://router.huggingface.co/v1/chat/completions"


class HuggingFaceAPIError(Exception):
    def __init__(self, status_code: int, message: str):
        super().__init__(message)
        self.status_code = status_code
        self.message = message


def _headers() -> dict[str, str]:
    if not settings.HUGGINGFACE_API_KEY:
        raise HuggingFaceAPIError(500, "HUGGINGFACE_API_KEY is not set")

    return {
        "Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json",
    }


def _build_payload(
    model: str,
    message: str,
    inference_settings: dict[str, Any],
    *,
    stream: bool,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "model": model,
        "messages": [{"role": "user", "content": message}],
        "max_tokens": inference_settings.get("max_tokens", 512),
        "temperature": inference_settings.get("temperature", 0.7),
        "top_p": inference_settings.get("top_p", 0.9),
        "stream": stream,
    }

    top_k = inference_settings.get("top_k")
    if top_k is not None:
        payload["top_k"] = top_k

    return payload


def _extract_error_message(response: httpx.Response) -> str:
    try:
        data = response.json()
    except ValueError:
        return response.text or f"Hugging Face router request failed with status {response.status_code}"

    if isinstance(data, dict):
        error = data.get("error")
        if isinstance(error, dict):
            return error.get("message") or json.dumps(error)
        if isinstance(error, str):
            return error

    return json.dumps(data)


async def send_huggingface_request(
    model: str,
    message: str,
    inference_settings: dict[str, Any],
) -> dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                CHAT_COMPLETIONS_URL,
                headers=_headers(),
                json=_build_payload(model, message, inference_settings, stream=False),
            )
            response.raise_for_status()
            return response.json()
    except HuggingFaceAPIError:
        raise
    except httpx.HTTPStatusError as e:
        message_text = _extract_error_message(e.response)
        logger.error("Hugging Face API error for model %s: %s", model, message_text)
        raise HuggingFaceAPIError(e.response.status_code, message_text) from e
    except httpx.HTTPError as e:
        logger.error("Hugging Face transport error for model %s: %s", model, str(e), exc_info=True)
        raise HuggingFaceAPIError(502, str(e)) from e


async def stream_huggingface_request(
    model: str,
    message: str,
    inference_settings: dict[str, Any],
) -> AsyncGenerator[str, None]:
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream(
                "POST",
                CHAT_COMPLETIONS_URL,
                headers=_headers(),
                json=_build_payload(model, message, inference_settings, stream=True),
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue

                    data_str = line[len("data: "):]
                    if data_str == "[DONE]":
                        break

                    try:
                        data = json.loads(data_str)
                    except json.JSONDecodeError:
                        continue

                    choices = data.get("choices", [])
                    if not choices:
                        continue

                    delta = choices[0].get("delta", {})
                    token = delta.get("content", "")
                    if token:
                        yield f"data: {json.dumps({'text': token})}\n\n"
    except HuggingFaceAPIError as e:
        logger.error("Streaming error on %s: %s", model, e.message)
        yield f"data: {json.dumps({'error': e.message})}\n\n"
    except httpx.HTTPStatusError as e:
        message_text = _extract_error_message(e.response)
        logger.error("Streaming error on %s: %s", model, message_text)
        yield f"data: {json.dumps({'error': message_text})}\n\n"
    except httpx.HTTPError as e:
        logger.error("Streaming transport error on %s: %s", model, str(e), exc_info=True)
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
