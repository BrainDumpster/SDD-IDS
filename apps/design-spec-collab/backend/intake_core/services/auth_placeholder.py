"""Auth placeholder — SSO/OIDC to be wired after stakeholder decision."""

from __future__ import annotations

from fastapi import HTTPException, Request

from ..config import settings

AUTH_PLACEHOLDER_MESSAGE = (
    "Auth is a placeholder. Stakeholder SSO/OIDC is not wired yet. "
    "Set AUTH_MODE=disabled for local use, or AUTH_MODE=placeholder "
    "to require X-Portal-Actor header as a temporary stand-in."
)


def resolve_actor(request: Request) -> str:
    """
    AUTH_MODE:
      - disabled: allow all; actor = anonymous or X-Portal-Actor
      - placeholder: require X-Portal-Actor (temporary identity until SSO)
      - enforced: reserved — returns 501 until real auth is implemented
    """
    mode = (settings.auth_mode or "disabled").strip().lower()
    header_actor = (request.headers.get("X-Portal-Actor") or "").strip()

    if mode == "disabled":
        return header_actor or "anonymous"

    if mode == "placeholder":
        if not header_actor:
            raise HTTPException(
                status_code=401,
                detail={
                    "code": "AUTH_PLACEHOLDER",
                    "message": (
                        "AUTH_MODE=placeholder requires header X-Portal-Actor "
                        "(temporary until SSO). " + AUTH_PLACEHOLDER_MESSAGE
                    ),
                },
            )
        return header_actor

    if mode == "enforced":
        raise HTTPException(
            status_code=501,
            detail={
                "code": "AUTH_NOT_IMPLEMENTED",
                "message": AUTH_PLACEHOLDER_MESSAGE,
            },
        )

    raise HTTPException(
        status_code=500,
        detail=f"Unknown AUTH_MODE={mode!r}. Use disabled | placeholder | enforced.",
    )


def auth_status() -> dict[str, str | bool]:
    mode = (settings.auth_mode or "disabled").strip().lower()
    return {
        "authMode": mode,
        "authImplemented": False,
        "authPlaceholder": True,
        "message": AUTH_PLACEHOLDER_MESSAGE,
    }
