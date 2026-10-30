"""Re-export Collab-owned intake stack (`intake_core`).

Historically this bridged into design-spec-portal via a symlink. Collab now
vendors the needed modules under ``backend/intake_core`` and does not import
portal at runtime.
"""

from __future__ import annotations

from intake_core.models.intake import (
    InheritsIds,
    IntakePreviewResponse,
    IntakeRequest,
)
from intake_core.models.jobs import CreateJobBody, JobRecord, JobStatus
from intake_core.services.additional_notes import sanitize_additional_notes
from intake_core.services.audit import AuditLog
from intake_core.services.auth_placeholder import auth_status, resolve_actor
from intake_core.services.job_store import JobStore
from intake_core.services.programmes import list_programmes, load_programme
from intake_core.services.prompt_builder import (
    build_prompt_package,
    build_session_yaml,
)
from intake_core.services.secrets import public_job_dict, redact_text
from intake_core.services.skill_router import build_preview
from intake_core import config as portal_config


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
    """Point intake_core settings at Collab/repo paths."""
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
