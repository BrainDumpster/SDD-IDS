"""Repo lock — cloud agent may only clone the server-configured repo URL."""

from __future__ import annotations

from urllib.parse import urlparse

from ..config import settings


def normalize_repo_url(url: str) -> str:
    raw = (url or "").strip().rstrip("/")
    if raw.endswith(".git"):
        raw = raw[:-4]
    # lower host for compare
    parsed = urlparse(raw)
    if parsed.scheme and parsed.netloc:
        return f"{parsed.scheme.lower()}://{parsed.netloc.lower()}{parsed.path}"
    return raw.lower()


def locked_repo_url() -> str:
    """Always from server env — never from client request."""
    url = (settings.cloud_repo_url or "").strip()
    if not url:
        raise ValueError("CLOUD_REPO_URL is not set (repo lock requires a server-side URL).")
    return url


def assert_repo_lock() -> str:
    """
    Validate CLOUD_REPO_URL against optional allowlist.
    ALLOWED_CLOUD_REPO_URLS=comma-separated; empty = only the locked URL itself.
    """
    locked = locked_repo_url()
    allow = settings.allowed_cloud_repo_urls
    if not allow:
        return locked
    locked_n = normalize_repo_url(locked)
    allowed_n = {normalize_repo_url(u) for u in allow if u.strip()}
    if locked_n not in allowed_n:
        raise ValueError(
            "Repo lock violation: CLOUD_REPO_URL is not in ALLOWED_CLOUD_REPO_URLS."
        )
    return locked


def repo_lock_status() -> dict:
    try:
        url = locked_repo_url()
        ok = True
        err = None
        try:
            assert_repo_lock()
        except ValueError as exc:
            ok = False
            err = str(exc)
    except ValueError as exc:
        url = None
        ok = False
        err = str(exc)
    return {
        "lockedRepoUrl": url,
        "allowedCloudRepoUrls": settings.allowed_cloud_repo_urls,
        "repoLockOk": ok,
        "repoLockError": err,
        "clientCannotOverride": True,
    }
