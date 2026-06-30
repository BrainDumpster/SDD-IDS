from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class StoryModel:
    """Framework-neutral story contract derived from design-spec + SpecContract."""

    title: str
    primary_story_name: str = "Spec Accurate Design"
    component_slug: str = ""
    component_display_name: str = ""
    design_system_slug: str = "ids"
    contract_import_path: str = ""
    contract_defaults_symbol: str = ""
    args: dict[str, Any] = field(default_factory=dict)
    arg_types: dict[str, dict[str, Any]] = field(default_factory=dict)
    variant_matrix: list[str] = field(default_factory=list)
    state_harness_css: str | None = None
    docs_description: str = ""


def build_button_story_model(
  *,
  options: "DeterministicStorybookOptions",
  contract_variants: list[str] | None = None,
) -> StoryModel:
    from generation.deterministic_storybook.models import DeterministicStorybookOptions

    options = options or DeterministicStorybookOptions()
    variants = [
        v
        for v in (contract_variants or ["primary", "secondary", "tertiary", "destructive"])
        if v in {"primary", "secondary", "tertiary", "destructive"}
    ] or ["primary", "secondary", "tertiary", "destructive"]

    use_dap_sizes = options.design_system_slug == "dap" and options.apply_program_deltas
    default_size = "medium" if use_dap_sizes else "lg"
    size_options = ["small", "medium", "large"] if use_dap_sizes else ["sm", "md", "lg"]

    programme = options.title_prefix.split("/")[-1] if "/" in options.title_prefix else "IDS"
    contract_path = "component-contracts/ids/button.contract"
    if options.design_system_slug == "dap" and options.apply_program_deltas:
        contract_path = "component-contracts/dap/button.contract"

    angular_args = {
        "variant": "primary",
        "size": default_size,
        "disabled": False,
        "loading": False,
        "iconOnly": False,
        "ariaLabel": "",
    }
    react_args = {
        "variant": "primary",
        "size": default_size,
        "children": "Button",
        "disabled": False,
        "loading": False,
        "iconOnly": False,
        "iconSlug": "settings-gear-detailed",
    }

    is_angular = getattr(options, "framework", "react").lower() == "angular"
    args = angular_args if is_angular else react_args

    return StoryModel(
        title=_component_story_title(options, "Button"),
        component_slug="button",
        component_display_name="Button",
        design_system_slug=options.design_system_slug,
        contract_import_path=contract_path,
        contract_defaults_symbol=(
            "DAP_BUTTON_DEFAULTS"
            if options.design_system_slug == "dap" and options.apply_program_deltas
            else "BUTTON_SPEC_ACCURATE_DEFAULTS"
        ),
        args=args,
        arg_types={
            "variant": {"control": "select", "options": variants},
            "size": {"control": "select", "options": size_options},
            "disabled": {"control": "boolean"},
            "loading": {"control": "boolean"},
            "iconOnly": {"control": "boolean"},
            **({"ariaLabel": {"control": "text"}} if is_angular else {}),
        },
        variant_matrix=variants,
        docs_description=(
            f"IDS Button per components/ids/button/design-spec.md. "
            f"Programme: {programme}. Uses shared component-contracts defaults."
        ),
    )


def build_accordion_story_model(
    *,
    options: "DeterministicStorybookOptions",
) -> StoryModel:
    from generation.deterministic_storybook.models import DeterministicStorybookOptions

    options = options or DeterministicStorybookOptions()
    programme = options.title_prefix.split("/")[-1] if "/" in options.title_prefix else "IDS"

    return StoryModel(
        title=_component_story_title(options, "Accordion"),
        component_slug="accordion",
        component_display_name="Accordion",
        design_system_slug=options.design_system_slug,
        contract_import_path="component-contracts/ids/accordion.contract",
        contract_defaults_symbol="ACCORDION_SPEC_ACCURATE_DEFAULTS",
        args={
            "multiple": False,
            "defaultValue": ["section1"],
            "chevronPosition": "left",
            "variant": "default",
        },
        arg_types={
            "multiple": {"control": "boolean"},
            "defaultValue": {"control": "object"},
            "variant": {"control": "select", "options": ["default", "form"]},
            "chevronPosition": {"control": "select", "options": ["left", "right"]},
        },
        variant_matrix=["default", "form"],
        docs_description=(
            f"IDS Accordion per {IDS_ACCORDION_DESIGN_SPEC_PATH}. "
            f"Programme: {programme}. Spec Accurate Design: single-expand, first panel open, left chevron."
        ),
    )


IDS_ACCORDION_DESIGN_SPEC_PATH = "components/ids/accordion/design-spec.md"
IDS_ALERT_DESIGN_SPEC_PATH = "components/ids/alert/design-spec.md"


def build_alert_story_model(
    *,
    options: "DeterministicStorybookOptions",
) -> StoryModel:
    from generation.deterministic_storybook.models import DeterministicStorybookOptions

    options = options or DeterministicStorybookOptions()
    programme = options.title_prefix.split("/")[-1] if "/" in options.title_prefix else "IDS"

    return StoryModel(
        title=_component_story_title(options, "Alert"),
        component_slug="alert",
        component_display_name="Alert",
        design_system_slug=options.design_system_slug,
        contract_import_path="component-contracts/ids/alert.contract",
        contract_defaults_symbol="ALERT_SPEC_ACCURATE_DEFAULTS",
        args={
            "display": "inline",
            "severity": "informational",
            "density": "compact",
            "messageText": "This is informational inline alert text for context.",
            "dismissible": True,
        },
        arg_types={
            "display": {"control": "select", "options": ["global", "inline"]},
            "severity": {
                "control": "select",
                "options": [
                    "informational",
                    "success",
                    "warning-minor",
                    "warning-major",
                    "critical",
                ],
            },
            "density": {"control": "select", "options": ["compact", "detailed"]},
            "messageText": {"control": "text"},
            "title": {"control": "text"},
            "linkLabel": {"control": "text"},
            "linkHref": {"control": "text"},
            "actionLabel": {"control": "text"},
            "dismissible": {"control": "boolean"},
        },
        variant_matrix=["global", "inline"],
        docs_description=(
            f"IDS Alert per {IDS_ALERT_DESIGN_SPEC_PATH}. "
            f"Programme: {programme}. Spec Accurate Design: inline informational compact."
        ),
    )


def _component_story_title(
    options: "DeterministicStorybookOptions",
    component_display_name: str,
) -> str:
    """Same sidebar path in React and Angular Storybook packages (isolated servers, no id clash)."""
    return f"{options.title_prefix}/{component_display_name}"


IDS_BADGE_DESIGN_SPEC_PATH = "components/ids/badge/design-spec.md"
IDS_MAIN_MENU_LEFT_DESIGN_SPEC_PATH = "components/ids/main-menu-left/design-spec.md"


def build_main_menu_left_story_model(
    *,
    options: "DeterministicStorybookOptions",
) -> StoryModel:
    from generation.deterministic_storybook.models import DeterministicStorybookOptions

    options = options or DeterministicStorybookOptions()
    programme = options.title_prefix.split("/")[-1] if "/" in options.title_prefix else "IDS"

    return StoryModel(
        title=_component_story_title(options, "Main Menu Left"),
        component_slug="main-menu-left",
        component_display_name="Main Menu Left",
        design_system_slug=options.design_system_slug,
        contract_import_path="component-contracts/ids/main-menu-left.contract",
        contract_defaults_symbol="MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS",
        args={
            "compositionMode": True,
            "expanded": True,
            "defaultSelectedItemId": "dashboard",
            "forceStates": False,
            "ariaLabel": "Main menu left",
        },
        arg_types={
            "compositionMode": {"control": "boolean"},
            "expanded": {"control": "boolean"},
            "defaultSelectedItemId": {"control": "text"},
            "forceStates": {"control": "boolean"},
        },
        docs_description=(
            f"IDS Main Menu/Left per {IDS_MAIN_MENU_LEFT_DESIGN_SPEC_PATH}. "
            f"Programme: {programme}. Composition API with deterministic Item | Group anatomy."
        ),
    )


def build_badge_story_model(
    *,
    options: "DeterministicStorybookOptions",
) -> StoryModel:
    from generation.deterministic_storybook.models import DeterministicStorybookOptions

    options = options or DeterministicStorybookOptions()
    programme = options.title_prefix.split("/")[-1] if "/" in options.title_prefix else "IDS"

    return StoryModel(
        title=_component_story_title(options, "Badge"),
        component_slug="badge",
        component_display_name="Badge",
        design_system_slug=options.design_system_slug,
        contract_import_path="component-contracts/ids/badge.contract",
        contract_defaults_symbol="BADGE_SPEC_ACCURATE_DEFAULTS",
        args={
            "value": 8,
            "type": "default",
            "ariaLabel": None,
        },
        arg_types={
            "value": {"control": "text"},
            "type": {
                "control": "select",
                "options": ["default", "critical", "warning", "disabled", "success"],
            },
            "ariaLabel": {"control": "text"},
        },
        variant_matrix=["default", "critical", "warning", "disabled", "success"],
        docs_description=(
            f"IDS Badge per {IDS_BADGE_DESIGN_SPEC_PATH}. "
            f"Programme: {programme}. Spec Accurate Design: default type, value 8."
        ),
    )
