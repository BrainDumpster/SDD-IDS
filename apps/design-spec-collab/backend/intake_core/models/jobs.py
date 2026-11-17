from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field

from .intake import IntakePreviewResponse, IntakeRequest


class JobStatus(str, Enum):
    pending = "pending"
    running = "running"
    finished = "finished"
    error = "error"
    cancelled = "cancelled"


class AgentPromptPackage(BaseModel):
    skill_route: str
    skill_path: str
    skill_relative_path: str
    confirmed_payload: dict[str, Any]
    map_entry_sketch: dict[str, Any]
    run_phase_checklist: list[str]
    prompt_text: str
    write_path_allowlist: list[str] = Field(default_factory=list)
    guardrails: list[str] = Field(default_factory=list)


class JobRecord(BaseModel):
    job_id: str
    status: JobStatus
    created_at: str
    updated_at: str
    request: dict[str, Any]
    preview: dict[str, Any]
    prompt_package: dict[str, Any]
    session_path: str | None = None
    actor: str | None = None
    cancel_requested: bool = False
    # Phase 3+
    agent_id: str | None = None
    run_id: str | None = None
    result_summary: str | None = None
    error_message: str | None = None
    pr_url: str | None = None
    branch: str | None = None
    ide_checkout_hint: str | None = None
    locked_repo_url: str | None = None


class CreateJobResponse(BaseModel):
    job_id: str
    status: JobStatus
    preview: IntakePreviewResponse
    prompt_package: AgentPromptPackage
    session_path: str | None = None
    agent_started: bool = False
    message: str = "Job created."


class CreateJobBody(BaseModel):
    """Same fields as intake + explicit confirm flag."""

    intake: IntakeRequest
    confirmed: bool = Field(
        ...,
        description="Must be true — mirrors wizard step 9 confirm.",
    )
    start_agent: bool | None = Field(
        default=None,
        alias="startAgent",
        description="Override CLOUD_AGENT_AUTO_START for this request.",
    )

    model_config = {"populate_by_name": True}
