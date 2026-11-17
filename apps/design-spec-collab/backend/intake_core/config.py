"""Collab-owned intake settings (formerly portal config)."""

from __future__ import annotations

import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def _default_repo_root() -> Path:
    """Monorepo root when running from source; /workspace in Docker."""
    here = Path(__file__).resolve()
    # Source: apps/design-spec-collab/backend/intake_core/config.py → parents[4]
    if len(here.parents) > 4:
        candidate = here.parents[4]
        if (candidate / "config" / "design_systems").is_dir():
            return candidate
    for path in (
        Path(os.environ.get("REPO_ROOT", "/workspace")),
        Path("/workspace"),
        Path.cwd(),
    ):
        if (path / "config" / "design_systems").is_dir():
            return path.resolve()
    return Path(os.environ.get("REPO_ROOT", "/workspace")).resolve()


def _default_app_root() -> Path:
    """Collab app root (`apps/design-spec-collab` or `/app` in Docker)."""
    here = Path(__file__).resolve()
    # .../backend/intake_core/config.py → parents[2] = collab root
    if len(here.parents) > 2:
        return here.parents[2]
    return Path("/app")


def _split_csv(raw: str | None) -> list[str]:
    if not raw:
        return []
    return [p.strip() for p in raw.split(",") if p.strip()]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    repo_root: Path = _default_repo_root()
    # Kept name for JobStore/Audit defaults; points at Collab app root.
    portal_root: Path = _default_app_root()
    design_systems_dir: Path | None = None
    jobs_dir: Path | None = None
    sessions_dir: Path | None = None
    audit_log_path: Path | None = None

    # Auth placeholder (SSO later)
    # disabled | placeholder | enforced
    auth_mode: str = "disabled"

    # Optional Cursor Cloud fields (unused by Collab runtime; kept for model compat)
    cursor_api_key: str | None = None
    figma_token: str | None = None
    github_token: str | None = None
    github_owner: str | None = None
    github_repo: str | None = None
    cloud_repo_url: str | None = None
    allowed_cloud_repo_urls_csv: str = ""
    cloud_starting_ref: str = "master"
    cursor_model: str = "composer-2.5"
    figma_mcp_url: str = "https://api.figma.com/mcp"
    cloud_auto_create_pr: bool = False
    cloud_agent_auto_start: bool = True
    cloud_agent_dry_run: bool = False
    cloud_agent_dry_run_seconds: float = 1.5
    cloud_agent_timeout_seconds: float = 3600.0

    @property
    def allowed_cloud_repo_urls(self) -> list[str]:
        return _split_csv(self.allowed_cloud_repo_urls_csv)

    def model_post_init(self, __context: object) -> None:
        if self.design_systems_dir is None:
            object.__setattr__(
                self,
                "design_systems_dir",
                self.repo_root / "config" / "design_systems",
            )
        if self.jobs_dir is None:
            object.__setattr__(self, "jobs_dir", self.portal_root / "data" / "jobs")
        if self.sessions_dir is None:
            object.__setattr__(
                self,
                "sessions_dir",
                self.repo_root / "data" / "design-spec-intake" / "sessions",
            )
        if self.audit_log_path is None:
            object.__setattr__(
                self,
                "audit_log_path",
                self.portal_root / "data" / "audit" / "audit.jsonl",
            )


settings = Settings()

if os.getenv("REPO_ROOT"):
    settings.repo_root = Path(os.environ["REPO_ROOT"]).resolve()
    settings.design_systems_dir = settings.repo_root / "config" / "design_systems"
    settings.sessions_dir = (
        settings.repo_root / "data" / "design-spec-intake" / "sessions"
    )
if os.getenv("DESIGN_SYSTEMS_DIR"):
    settings.design_systems_dir = Path(os.environ["DESIGN_SYSTEMS_DIR"]).resolve()
if os.getenv("JOBS_DIR"):
    settings.jobs_dir = Path(os.environ["JOBS_DIR"]).resolve()
if os.getenv("SESSIONS_DIR"):
    settings.sessions_dir = Path(os.environ["SESSIONS_DIR"]).resolve()
if os.getenv("AUDIT_LOG_PATH"):
    settings.audit_log_path = Path(os.environ["AUDIT_LOG_PATH"]).resolve()


def _env_bool(name: str, current: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return current
    return raw.strip().lower() in {"1", "true", "yes", "on"}


settings.cloud_auto_create_pr = _env_bool(
    "CLOUD_AUTO_CREATE_PR", settings.cloud_auto_create_pr
)
settings.cloud_agent_auto_start = _env_bool(
    "CLOUD_AGENT_AUTO_START", settings.cloud_agent_auto_start
)
settings.cloud_agent_dry_run = _env_bool(
    "CLOUD_AGENT_DRY_RUN", settings.cloud_agent_dry_run
)
if os.getenv("AUTH_MODE"):
    settings.auth_mode = os.environ["AUTH_MODE"].strip().lower()
if os.getenv("CURSOR_MODEL"):
    settings.cursor_model = os.environ["CURSOR_MODEL"]
if os.getenv("FIGMA_MCP_URL"):
    settings.figma_mcp_url = os.environ["FIGMA_MCP_URL"]
if os.getenv("CLOUD_STARTING_REF"):
    settings.cloud_starting_ref = os.environ["CLOUD_STARTING_REF"]
if os.getenv("CURSOR_API_KEY"):
    settings.cursor_api_key = os.environ["CURSOR_API_KEY"]
if os.getenv("FIGMA_TOKEN"):
    settings.figma_token = os.environ["FIGMA_TOKEN"]
if os.getenv("GITHUB_TOKEN"):
    settings.github_token = os.environ["GITHUB_TOKEN"]
if os.getenv("GITHUB_OWNER"):
    settings.github_owner = os.environ["GITHUB_OWNER"]
if os.getenv("GITHUB_REPO"):
    settings.github_repo = os.environ["GITHUB_REPO"]
if os.getenv("CLOUD_REPO_URL"):
    settings.cloud_repo_url = os.environ["CLOUD_REPO_URL"]
if os.getenv("ALLOWED_CLOUD_REPO_URLS"):
    settings.allowed_cloud_repo_urls_csv = os.environ["ALLOWED_CLOUD_REPO_URLS"]
elif settings.cloud_repo_url and not settings.allowed_cloud_repo_urls_csv:
    settings.allowed_cloud_repo_urls_csv = settings.cloud_repo_url
if os.getenv("CLOUD_AGENT_TIMEOUT_SECONDS"):
    try:
        settings.cloud_agent_timeout_seconds = float(
            os.environ["CLOUD_AGENT_TIMEOUT_SECONDS"]
        )
    except ValueError:
        pass
