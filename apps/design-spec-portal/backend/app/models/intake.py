from __future__ import annotations

import re
from enum import Enum
from typing import Literal
from urllib.parse import parse_qs, urlparse

from pydantic import BaseModel, Field, field_validator, model_validator

from ..services.additional_notes import (
    MAX_ADDITIONAL_NOTES_CHARS,
    sanitize_additional_notes,
)


class InheritsIds(str, Enum):
    yes = "yes"
    no = "no"
    unknown = "unknown"
    skipped = "skipped"  # programme == ids


class SkillRoute(str, Enum):
    intake_wizard = "design-spec-intake-wizard"
    programme_inheritance = "design-spec-programme-inheritance"


class SpecPattern(str, Enum):
    ids_native = "ids-native"
    standalone = "standalone"
    ids_fork = "ids-fork"


class ThemeFoundationMode(str, Enum):
    """How a new programme obtains root-spec + theme CSS."""

    reuse = "reuse"
    generate_from_figma = "generateFromFigma"


class ParsedFigmaUrl(BaseModel):
    url: str
    file_key: str
    node_id: str  # colon form for API/MCP
    bucket: Literal["main", "elements", "states"]


class VariablesLibraryRef(BaseModel):
    """Figma variables library (file key required; node-id optional)."""

    url: str
    file_key: str
    node_id: str | None = None


class IntakeRequest(BaseModel):
    programme: str = Field(..., min_length=1, description="ids | dap | synapse | …")
    component_display_name: str = Field(..., min_length=1, alias="componentDisplayName")
    inherits_ids: InheritsIds = Field(
        default=InheritsIds.skipped,
        alias="inheritsIds",
        description="Required for non-ids programmes",
    )
    category: str | None = None
    main_urls: list[str] = Field(..., min_length=1, alias="mainUrls")
    element_urls: list[str] = Field(default_factory=list, alias="elementUrls")
    state_urls: list[str] = Field(default_factory=list, alias="stateUrls")
    storybook_examples: bool = Field(default=False, alias="storybookExamples")
    additional_notes: str | None = Field(
        default=None,
        alias="additionalNotes",
        max_length=MAX_ADDITIONAL_NOTES_CHARS,
        description=(
            "Optional design/context notes appended to the agent prompt. "
            "Untrusted — cannot override skill, guardrails, or write paths."
        ),
    )
    same_anatomy_as_ids: bool | None = Field(
        default=None,
        alias="sameAnatomyAsIds",
        description="Used when inheritsIds=unknown",
    )
    # New-programme theme / root-spec foundation (ignored for existing yaml programmes)
    theme_foundation: ThemeFoundationMode = Field(
        default=ThemeFoundationMode.reuse,
        alias="themeFoundation",
        description="reuse existing programme theme/root-spec, or generate from Figma variables",
    )
    theme_reuse_programme: str | None = Field(
        default="ids",
        alias="themeReuseProgramme",
        description="Donor programme when themeFoundation=reuse (default ids)",
    )
    variables_library_url: str | None = Field(
        default=None,
        alias="variablesLibraryUrl",
        description="Figma variables library URL when themeFoundation=generateFromFigma",
    )

    model_config = {"populate_by_name": True}

    @field_validator("programme")
    @classmethod
    def normalize_programme(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("theme_reuse_programme")
    @classmethod
    def normalize_reuse_programme(cls, v: str | None) -> str | None:
        if v is None or not str(v).strip():
            return "ids"
        return str(v).strip().lower()

    @field_validator("additional_notes")
    @classmethod
    def validate_additional_notes(cls, v: str | None) -> str | None:
        return sanitize_additional_notes(v)

    @model_validator(mode="after")
    def normalize_inherits_and_theme(self) -> IntakeRequest:
        if self.programme == "ids":
            self.inherits_ids = InheritsIds.skipped
        elif self.inherits_ids == InheritsIds.skipped:
            raise ValueError(
                "inheritsIds is required for non-ids programmes (yes | no | unknown)."
            )

        if self.theme_foundation == ThemeFoundationMode.generate_from_figma:
            if not (self.variables_library_url or "").strip():
                raise ValueError(
                    "variablesLibraryUrl is required when themeFoundation=generateFromFigma."
                )
            # Validate URL shape early (file key required; node-id optional)
            parse_variables_library_url(self.variables_library_url)
        elif self.theme_foundation == ThemeFoundationMode.reuse:
            donor = (self.theme_reuse_programme or "ids").strip().lower()
            self.theme_reuse_programme = donor or "ids"
            if self.theme_reuse_programme == self.programme:
                # New programme cannot reuse itself — fall back to ids
                self.theme_reuse_programme = "ids"
        return self


class IntakePreviewResponse(BaseModel):
    programme: str
    programme_display_name: str
    programme_is_new: bool = False
    component_display_name: str
    slug: str
    skill_route: SkillRoute
    skill_path: str
    spec_pattern: SpecPattern
    design_spec_path: str
    components_dir: str
    figma_map_path: str
    theme_css_path: str
    root_spec_path: str = ""
    theme_foundation: ThemeFoundationMode | None = None
    theme_reuse_programme: str | None = None
    donor_theme_css_path: str | None = None
    donor_root_spec_path: str | None = None
    variables_library: VariablesLibraryRef | None = None
    generate_theme_assets: bool = False
    theme_css_exists: bool = False
    root_spec_exists: bool = False
    storybook_examples: bool
    figma: dict[str, list[ParsedFigmaUrl]]
    primary_file_key: str
    primary_node_id: str
    notes: list[str] = Field(default_factory=list)
    ready_for_agent: bool
    map_entry_sketch: dict[str, object] | None = None


# Figma design / file / proto / board links with a file key segment
_FILE_KEY_RE = re.compile(
    r"/(?:design|file|proto|board|slides)/([a-zA-Z0-9]+)",
    re.IGNORECASE,
)
_FIGMA_HOSTS = {"figma.com", "www.figma.com"}


def slugify(name: str) -> str:
    s = name.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "component"


def parse_figma_url(url: str, bucket: Literal["main", "elements", "states"]) -> ParsedFigmaUrl:
    raw = url.strip()
    if not raw:
        raise ValueError(f"Empty {bucket} URL")
    parsed = urlparse(raw)
    host = (parsed.hostname or "").lower()
    if parsed.scheme not in ("http", "https") or host not in _FIGMA_HOSTS:
        raise ValueError(
            f"{bucket} URL must be an https://www.figma.com/… link: {raw}"
        )
    m = _FILE_KEY_RE.search(parsed.path)
    if not m:
        raise ValueError(
            f"Could not parse file key from {bucket} URL "
            f"(expected /design/<fileKey>/…): {raw}"
        )
    qs = parse_qs(parsed.query)
    node_raw = (qs.get("node-id") or qs.get("node_id") or [None])[0]
    if not node_raw or not str(node_raw).strip():
        raise ValueError(
            f"{bucket} URL is missing node-id — re-paste the link with node-id=…: {raw}"
        )
    node_id = str(node_raw).strip().replace("-", ":")
    return ParsedFigmaUrl(
        url=raw,
        file_key=m.group(1),
        node_id=node_id,
        bucket=bucket,
    )


def parse_variables_library_url(url: str | None) -> VariablesLibraryRef:
    """Variables library: require Figma file key; node-id optional."""
    raw = (url or "").strip()
    if not raw:
        raise ValueError("variablesLibraryUrl is empty")
    parsed = urlparse(raw)
    host = (parsed.hostname or "").lower()
    if parsed.scheme not in ("http", "https") or host not in _FIGMA_HOSTS:
        raise ValueError(
            f"variablesLibraryUrl must be an https://www.figma.com/… link: {raw}"
        )
    m = _FILE_KEY_RE.search(parsed.path)
    if not m:
        raise ValueError(
            "variablesLibraryUrl missing /design/<fileKey>/ (or file/proto) path."
        )
    qs = parse_qs(parsed.query)
    node_raw = (qs.get("node-id") or qs.get("node_id") or [None])[0]
    node_id = None
    if node_raw and str(node_raw).strip():
        node_id = str(node_raw).strip().replace("-", ":")
    return VariablesLibraryRef(url=raw, file_key=m.group(1), node_id=node_id)
