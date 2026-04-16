import json
import time
from typing import Any

import jwt
import requests
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec, rsa, padding
from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.core.config import settings

bearer_scheme = HTTPBearer(auto_error=False)

_JWKS_CACHE: dict | None = None
_JWKS_CACHE_EXPIRES_AT: float = 0.0
_JWKS_CACHE_TTL_SECONDS = 60 * 60


def _get_supabase_url() -> str:
    url = (settings.SUPABASE_URL or "").strip().rstrip("/")
    if not url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "SUPABASE_URL is not configured"},
        )
    return url


def _get_jwks_url() -> str:
    supabase_url = _get_supabase_url()
    return f"{supabase_url}/auth/v1/.well-known/jwks.json"


def _fetch_jwks() -> dict:
    jwks_url = _get_jwks_url()
    resp = requests.get(jwks_url, timeout=10)
    resp.raise_for_status()
    jwks = resp.json()
    if not isinstance(jwks, dict) or "keys" not in jwks:
        raise ValueError("Invalid JWKS response")
    return jwks


def _get_jwks(force_refresh: bool = False) -> dict:
    global _JWKS_CACHE, _JWKS_CACHE_EXPIRES_AT

    now = time.time()
    if not force_refresh and _JWKS_CACHE is not None and now < _JWKS_CACHE_EXPIRES_AT:
        return _JWKS_CACHE

    jwks = _fetch_jwks()
    _JWKS_CACHE = jwks
    _JWKS_CACHE_EXPIRES_AT = now + _JWKS_CACHE_TTL_SECONDS
    return jwks


def _base64_to_int(s: str) -> int:
    """Convert base64url encoded string to integer."""
    import base64
    data = base64.urlsafe_b64decode(s + "=" * (4 - len(s) % 4))
    return int.from_bytes(data, byteorder="big")


def _jwk_to_key(jwk: dict, alg: str) -> Any:
    """Convert JWK to a key object that PyJWT can use."""
    kty = jwk.get("kty")

    if kty == "RSA":
        n = _base64_to_int(jwk["n"])
        e = _base64_to_int(jwk["e"])
        public_numbers = rsa.RSAPublicNumbers(e, n)
        return public_numbers.public_key(default_backend())

    if kty == "EC":
        x = _base64_to_int(jwk["x"])
        y = _base64_to_int(jwk["y"])
        crv = jwk.get("crv", "P-256")

        if crv == "P-256":
            curve = ec.SECP256R1()
        elif crv == "P-384":
            curve = ec.SECP384R1()
        elif crv == "P-521":
            curve = ec.SECP521R1()
        else:
            raise ValueError(f"Unsupported elliptic curve: {crv}")

        public_numbers = ec.EllipticCurvePublicNumbers(x, y, curve)
        return public_numbers.public_key(default_backend())

    raise ValueError(f"Unsupported key type: {kty}")


def verify_supabase_jwt(token: str) -> dict:
    try:
        unverified_header = jwt.get_unverified_header(token)
        print("JWT Header:", unverified_header)

        kid = unverified_header.get("kid")
        alg = unverified_header.get("alg")
        if not kid or not alg:
            raise ValueError("Missing kid/alg in JWT header")

        jwks = _get_jwks()
        key = None
        for jwk in jwks.get("keys", []):
            if jwk.get("kid") == kid:
                key = _jwk_to_key(jwk, alg)
                break

        if key is None:
            jwks = _get_jwks(force_refresh=True)
            for jwk in jwks.get("keys", []):
                if jwk.get("kid") == kid:
                    key = _jwk_to_key(jwk, alg)
                    break

        if key is None:
            raise Exception("Key not found")

        payload = jwt.decode(
            token,
            key,
            algorithms=[alg],
            audience="authenticated",
        )

        print("Decoded User:", payload)
        return payload

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}") from e


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Missing token"},
        )

    token = credentials.credentials.strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Missing token"},
        )

    payload = verify_supabase_jwt(token)

    user = {
        "user_id": payload.get("sub"),
        "email": payload.get("email"),
        "role": payload.get("role"),
        "payload": payload,
    }

    if not user["user_id"] or user["role"] not in {None, "authenticated"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "Unauthorized access"},
        )

    return user
