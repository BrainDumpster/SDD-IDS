from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class SessionStatus(str, Enum):
    packaging = "packaging"
    awaiting_client = "awaiting_client"
    reviewing = "reviewing"
    done = "done"
    failed = "failed"
    cancelled = "cancelled"


class ClientRequest(BaseModel):
    id: str
    kind: str  # write_design_spec | fill_gaps | revise_sections
    instruction: str
    expected_artifact: str | None = None


class TranscriptEvent(BaseModel):
    at: str
    kind: str
    message: str
    detail: dict[str, Any] = Field(default_factory=dict)


class Artifact(BaseModel):
    name: str
    content: str
    role: str | None = None  # context | baseline | output
    read_only: bool | None = Field(default=None, alias="readOnly")

    model_config = {"populate_by_name": True}


class ClientResultBody(BaseModel):
    turn: int
    summary: str | None = None
    artifacts: list[Artifact] = Field(default_factory=list)
    answers: dict[str, str] = Field(default_factory=dict)
    client_nonce: str | None = Field(default=None, alias="clientNonce")

    model_config = {"populate_by_name": True}


class ClaimBody(BaseModel):
    client_label: str | None = Field(default=None, alias="clientLabel")
    # Session-token holder may take over a stale/wrong claim (Bridge vs pasted Devin).
    force: bool = False

    model_config = {"populate_by_name": True}


class HeartbeatBody(BaseModel):
    client_label: str | None = Field(default=None, alias="clientLabel")
    # Short status line from Bridge (e.g. "Devin turn 2 — writing artifacts")
    progress: str | None = Field(default=None, max_length=500)

    model_config = {"populate_by_name": True}


class ChatBody(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class ReviewVerdict(BaseModel):
    decision: str  # accept | revise
    score: float = 0.0
    feedback: str = ""
    missing_criteria: list[str] = Field(default_factory=list)


class CollabSession(BaseModel):
    session_id: str
    access_token: str
    job_id: str
    status: SessionStatus
    created_at: str
    updated_at: str
    expires_at: str
    actor: str | None = None
    turn: int = 0
    max_turns: int = 3
    client_nonce: str | None = None
    client_label: str | None = None
    claimed_at: str | None = None
    prior_feedback: str | None = None
    client_requests: list[ClientRequest] = Field(default_factory=list)
    figma_evidence: dict[str, Any] = Field(default_factory=dict)
    prompt_package: dict[str, Any] = Field(default_factory=dict)
    preview: dict[str, Any] = Field(default_factory=dict)
    request: dict[str, Any] = Field(default_factory=dict)
    artifacts: list[Artifact] = Field(default_factory=list)
    transcript: list[TranscriptEvent] = Field(default_factory=list)
    revise_count: int = 0
    error_message: str | None = None
    result_summary: str | None = None
    cancel_requested: bool = False
    job_kind: str = "create"  # create | update | review_revise
    baseline_artifacts: list[Artifact] = Field(default_factory=list)
    context_artifacts: list[Artifact] = Field(default_factory=list)
    change_hints: list[str] = Field(default_factory=list)
    # Post-accept publish (server git ops — no LLM)
    branch: str | None = None
    pr_url: str | None = None
    ide_checkout_hint: str | None = None
    published_files: list[str] = Field(default_factory=list)
    publish_error: str | None = None
    publish_dry_run: bool = False
    bridge_last_heartbeat_at: str | None = None
    bridge_label: str | None = None
    bridge_progress: str | None = None
    # Live stage text while status=packaging (cleared when awaiting_client)
    packaging_progress: str | None = None
    # Operator idle End (B2): finished session closed for follow-up; Bridge process not killed
    operator_closed: bool = False
    operator_closed_at: str | None = None

    def session_url(self, public_base_url: str) -> str:
        base = public_base_url.rstrip("/")
        return f"{base}/s/{self.session_id}?t={self.access_token}"

    def bridge_command(self, public_base_url: str, *, ai_cli: str = "devin") -> str:
        """One-shot command shown in Collab UI (outbound Bridge Agent)."""
        base = public_base_url.rstrip("/")
        session = self.session_url(public_base_url)
        ai_flag = f" --ai-cli {ai_cli}" if ai_cli and ai_cli != "devin" else ""
        return (
            f'curl -fsSL "{base}/bridge/collab_bridge.py" -o /tmp/collab_bridge.py '
            f'&& python3 /tmp/collab_bridge.py run \'{session}\'{ai_flag}'
        )
