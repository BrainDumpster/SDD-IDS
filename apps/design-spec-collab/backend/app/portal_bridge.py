"""Import design-spec-portal intake stack via backend/portal_app symlink."""

from __future__ import annotations

from portal_app.models.intake import (
    InheritsIds,
    IntakePreviewResponse,
    IntakeRequest,
)
from portal_app.models.jobs import CreateJobBody, JobRecord, JobStatus
from portal_app.services.additional_notes import sanitize_additional_notes
from portal_app.services.audit import AuditLog
from portal_app.services.auth_placeholder import auth_status, resolve_actor
from portal_app.services.job_store import JobStore
from portal_app.services.programmes import list_programmes, load_programme
from portal_app.services.prompt_builder import (
    build_prompt_package,
    build_session_yaml,
)
from portal_app.services.secrets import public_job_dict, redact_text
from portal_app.services.skill_router import build_preview
from portal_app import config as portal_config


def sync_portal_auth_mode(auth_mode: str) -> None:
    portal_config.settings.auth_mode = auth_mode


def sync_portal_paths(
    *,
    repo_root,
    design_systems_dir,
    jobs_dir,
    sessions_dir,
    audit_log_path,
) -> None:
    """Point portal modules at collab/repo paths."""
    portal_config.settings.repo_root = repo_root
    portal_config.settings.design_systems_dir = design_systems_dir
    portal_config.settings.jobs_dir = jobs_dir
    portal_config.settings.sessions_dir = sessions_dir
    portal_config.settings.audit_log_path = audit_log_path


__all__ = [
    "InheritsIds",
    "IntakePreviewResponse",
    "IntakeRequest",
    "CreateJobBody",
    "JobRecord",
    "JobStatus",
    "sanitize_additional_notes",
    "AuditLog",
    "auth_status",
    "resolve_actor",
    "JobStore",
    "list_programmes",
    "load_programme",
    "build_prompt_package",
    "build_session_yaml",
    "public_job_dict",
    "redact_text",
    "build_preview",
    "sync_portal_auth_mode",
    "sync_portal_paths",
    "portal_config",
]
