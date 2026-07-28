"""Update design-spec request models (collab)."""

from __future__ import annotations

from pydantic import BaseModel, Field, field_validator

from portal_app.services.additional_notes import MAX_ADDITIONAL_NOTES_CHARS

from .portal_bridge import sanitize_additional_notes


class UpdateRequest(BaseModel):
    programme: str = Field(..., min_length=1)
    component_slug: str = Field(..., min_length=1, alias="componentSlug")
    additional_main_urls: list[str] = Field(
        default_factory=list, alias="additionalMainUrls"
    )
    additional_element_urls: list[str] = Field(
        default_factory=list, alias="additionalElementUrls"
    )
    additional_state_urls: list[str] = Field(
        default_factory=list, alias="additionalStateUrls"
    )
    additional_prompt: str | None = Field(
        default=None,
        alias="additionalPrompt",
        max_length=MAX_ADDITIONAL_NOTES_CHARS,
    )
    storybook_examples: bool = Field(default=False, alias="storybookExamples")

    model_config = {"populate_by_name": True}

    @field_validator("programme")
    @classmethod
    def normalize_programme(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("component_slug")
    @classmethod
    def normalize_slug(cls, v: str) -> str:
        s = v.strip().lower().replace("_", "-")
        return s.strip("-") or s

    @field_validator("additional_prompt")
    @classmethod
    def validate_prompt(cls, v: str | None) -> str | None:
        return sanitize_additional_notes(v)


class CreateUpdateJobBody(BaseModel):
    update: UpdateRequest
    confirmed: bool = False

    model_config = {"populate_by_name": True}
