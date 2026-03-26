from functools import lru_cache

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from jose import jwk as jose_jwk

from config import settings

bearer = HTTPBearer()


@lru_cache(maxsize=1)
def _get_jwks() -> list[dict]:
    """Fetch and cache the Supabase JWKS public keys (fetched once on first use)."""
    url = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
    res = httpx.get(url, timeout=10)
    res.raise_for_status()
    return res.json()["keys"]


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
) -> dict:
    token = credentials.credentials
    try:
        header = jwt.get_unverified_header(token)
        keys = _get_jwks()
        key = next((k for k in keys if k.get("kid") == header.get("kid")), None)
        if key is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No matching signing key")
        public_key = jose_jwk.construct(key)
        payload = jwt.decode(
            token,
            public_key,
            algorithms=[header.get("alg", "ES256")],
            audience="authenticated",
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")


def get_user_id(user: dict = Depends(get_current_user)) -> str:
    return user["sub"]
