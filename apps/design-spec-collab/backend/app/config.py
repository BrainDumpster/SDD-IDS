from __future__ import annotations

import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def _default_repo_root() -> Path:
    here = Path(__file__).resolve()
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
    here = Path(__file__).resolve()
    if len(here.parents) > 2:
        return here.parents[2]
    return Path("/app")


def _env_bool(name: str, current: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return current
    return raw.strip().lower() in {"1", "true", "yes", "on"}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(
            str(_default_app_root() / ".env"),
            ".env",
        ),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    repo_root: Path = _default_repo_root()
    app_root: Path = _default_app_root()
    design_systems_dir: Path | None = None
    jobs_dir: Path | None = None
    sessions_dir: Path | None = None
    collab_sessions_dir: Path | None = None
    audit_log_path: Path | None = None

    auth_mode: str = "disabled"
    public_base_url: str = "http://127.0.0.1:8091"
    figma_token: str | None = None
    figma_mode: str = "rest"  # stub | mcp | rest (live→rest)
    figma_mcp_url: str = "https://api.figma.com/mcp"
    server_review_mode: str = "rules"  # rules | ollama
    ollama_host: str = "http://127.0.0.1:11434"
    ollama_model: str = "llama3"
    collab_max_turns: int = 3
    client_poll_hint_ms: int = 2000
    session_ttl_hours: float = 24.0
    session_require_claim: bool = True
    # Stub review: force one revise before accept (demo path)
    stub_force_revise_once: bool = True
    result_post_rate_limit_per_minute: int = 30
    # GitHub publish after accept (REST only — no LLM)
    github_token: str | None = None
    github_owner: str | None = None
    github_repo: str | None = None
    github_repo_url: str | None = None
    github_starting_ref: str = "master"
    github_publish_dry_run: bool = False
    auto_create_pr: bool = True
    # Static Storybook build for Spec Accurate Design iframe preview
    storybook_static_dir: Path | None = None

    def model_post_init(self, __context: object) -> None:
        if self.design_systems_dir is None:
            object.__setattr__(
                self,
                "design_systems_dir",
                self.repo_root / "config" / "design_systems",
            )
        if self.jobs_dir is None:
            object.__setattr__(self, "jobs_dir", self.app_root / "data" / "jobs")
        if self.sessions_dir is None:
            object.__setattr__(
                self,
                "sessions_dir",
                self.repo_root / "data" / "design-spec-intake" / "sessions",
            )
        if self.collab_sessions_dir is None:
            object.__setattr__(
                self,
                "collab_sessions_dir",
                self.app_root / "data" / "collab_sessions",
            )
        if self.audit_log_path is None:
            object.__setattr__(
                self,
                "audit_log_path",
                self.app_root / "data" / "audit" / "audit.jsonl",
            )
        if self.storybook_static_dir is None:
            object.__setattr__(
                self,
                "storybook_static_dir",
                self.app_root / "storybook-static",
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
if os.getenv("COLLAB_SESSIONS_DIR"):
    settings.collab_sessions_dir = Path(os.environ["COLLAB_SESSIONS_DIR"]).resolve()
if os.getenv("AUDIT_LOG_PATH"):
    settings.audit_log_path = Path(os.environ["AUDIT_LOG_PATH"]).resolve()
if os.getenv("AUTH_MODE"):
    settings.auth_mode = os.environ["AUTH_MODE"].strip().lower()
if os.getenv("PUBLIC_BASE_URL"):
    settings.public_base_url = os.environ["PUBLIC_BASE_URL"].rstrip("/")
if os.getenv("FIGMA_TOKEN"):
    settings.figma_token = os.environ["FIGMA_TOKEN"]
if os.getenv("FIGMA_MODE"):
    settings.figma_mode = os.environ["FIGMA_MODE"].strip().lower()
if os.getenv("FIGMA_MCP_URL"):
    settings.figma_mcp_url = os.environ["FIGMA_MCP_URL"].strip().rstrip("/")
if os.getenv("SERVER_REVIEW_MODE"):
    settings.server_review_mode = os.environ["SERVER_REVIEW_MODE"].strip().lower()
if os.getenv("OLLAMA_HOST"):
    settings.ollama_host = os.environ["OLLAMA_HOST"].rstrip("/")
if os.getenv("OLLAMA_MODEL"):
    settings.ollama_model = os.environ["OLLAMA_MODEL"]
if os.getenv("COLLAB_MAX_TURNS"):
    try:
        settings.collab_max_turns = int(os.environ["COLLAB_MAX_TURNS"])
    except ValueError:
        pass
if os.getenv("CLIENT_POLL_HINT_MS"):
    try:
        settings.client_poll_hint_ms = int(os.environ["CLIENT_POLL_HINT_MS"])
    except ValueError:
        pass
if os.getenv("SESSION_TTL_HOURS"):
    try:
        settings.session_ttl_hours = float(os.environ["SESSION_TTL_HOURS"])
    except ValueError:
        pass
settings.session_require_claim = _env_bool(
    "SESSION_REQUIRE_CLAIM", settings.session_require_claim
)
settings.stub_force_revise_once = _env_bool(
    "STUB_FORCE_REVISE_ONCE", settings.stub_force_revise_once
)
settings.github_publish_dry_run = _env_bool(
    "GITHUB_PUBLISH_DRY_RUN", settings.github_publish_dry_run
)
settings.auto_create_pr = _env_bool("AUTO_CREATE_PR", settings.auto_create_pr)
if os.getenv("GITHUB_TOKEN"):
    settings.github_token = os.environ["GITHUB_TOKEN"]
if os.getenv("GITHUB_OWNER"):
    settings.github_owner = os.environ["GITHUB_OWNER"]
if os.getenv("GITHUB_REPO"):
    settings.github_repo = os.environ["GITHUB_REPO"]
if os.getenv("GITHUB_REPO_URL") or os.getenv("CLOUD_REPO_URL"):
    settings.github_repo_url = (
        os.environ.get("GITHUB_REPO_URL") or os.environ.get("CLOUD_REPO_URL")
    )
if os.getenv("GITHUB_STARTING_REF") or os.getenv("CLOUD_STARTING_REF"):
    settings.github_starting_ref = (
        os.environ.get("GITHUB_STARTING_REF")
        or os.environ.get("CLOUD_STARTING_REF")
        or settings.github_starting_ref
    )
if os.getenv("STORYBOOK_STATIC_DIR"):
    settings.storybook_static_dir = Path(os.environ["STORYBOOK_STATIC_DIR"]).resolve()
