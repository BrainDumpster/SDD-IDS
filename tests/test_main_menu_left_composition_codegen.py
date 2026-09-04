"""Tests for Main Menu/Left deterministic composition codegen."""

from __future__ import annotations

import re
from pathlib import Path

from generation.deterministic_storybook.ids.main_menu_left import generate_ids_main_menu_left_story
from generation.deterministic_storybook.ids.main_menu_left_angular import (
    generate_ids_main_menu_left_story_angular,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from generation.spec_derived.main_menu_left_composition import (
    MAIN_MENU_LEFT_GROUP_ANATOMY,
    MAIN_MENU_LEFT_ITEM_ANATOMY,
    SPEC_ACCURATE_ITEMS,
    emit_angular_composition_root,
    emit_react_menu_list,
)
from validation.spec_contract_parser import SpecContract

REPO_ROOT = Path(__file__).resolve().parent.parent


def _empty_contract() -> SpecContract:
    return SpecContract(component="main-menu-left")


def test_group_anatomy_order_in_react_markup():
    jsx = emit_react_menu_list()
    infra = jsx.index("MainMenuLeftGroup groupId=\"infrastructure\"")
    primary = jsx.index("MainMenuLeftItem itemId=\"infrastructure\"", infra)
    children = jsx.index("<MainMenuLeftChildren>", primary)
    secondary = jsx.index('level="secondary"', children)
    assert infra < primary < children < secondary


def test_group_anatomy_order_in_angular_markup():
    html = emit_angular_composition_root()
    infra = html.index('groupId="infrastructure"')
    primary = html.index('itemId="infrastructure"', infra)
    children = html.index("<ids-main-menu-left-children>", primary)
    secondary = html.index('level="secondary"', children)
    assert infra < primary < children < secondary


def test_item_anatomy_link_host_icon_label():
    jsx = emit_react_menu_list()
    dash = jsx.index('itemId="dashboard"')
    snippet = jsx[dash : dash + 400]
    assert "<a href=" in snippet
    assert "MainMenuLeftItemIcon shapeName=\"home\"" in snippet
    assert "primaryLabel" in snippet


def test_infrastructure_group_default_expanded_false():
    jsx = emit_react_menu_list()
    assert 'defaultExpanded={false}' in jsx
    html = emit_angular_composition_root()
    assert '[defaultExpanded]="false"' in html


def test_react_generator_emits_composition_not_items_prop():
    story = generate_ids_main_menu_left_story(
        repo_root=REPO_ROOT,
        story_path=REPO_ROOT / "storybook-generated/ids/src/components/MainMenuLeft.stories.tsx",
        contract=_empty_contract(),
        options=DeterministicStorybookOptions(),
    )
    assert "MainMenuLeftGroup" in story
    assert "MainMenuLeftChildren" in story
    assert "items={" not in story
    assert "defaultSelectedItemId: \"dashboard\"" in story


def test_angular_generator_emits_composition_stories():
    story = generate_ids_main_menu_left_story_angular(
        repo_root=REPO_ROOT,
        story_path=REPO_ROOT
        / "storybook-angular/src/components/ids-main-menu-left/ids-main-menu-left.stories.js",
        contract=_empty_contract(),
        options=DeterministicStorybookOptions(framework="angular"),
    )
    assert "MAIN_MENU_LEFT_COMPOSITION_DEMO_TEMPLATE" in story
    assert "LegacyItemsAdapter" in story
    assert "PrimaryStateSnapshotMatrix" in story
    assert "SecondaryStateSnapshotMatrix" in story


def test_contract_anatomy_constants_documented_in_spec():
    spec = (REPO_ROOT / "components/ids/main-menu-left/design-spec.md").read_text(encoding="utf-8")
    contract = (REPO_ROOT / "component-contracts/ids/main-menu-left.contract.ts").read_text(
        encoding="utf-8"
    )
    assert "MAIN_MENU_LEFT_COMPOSITION_ANATOMY" in spec
    assert "MAIN_MENU_LEFT_GROUP_ANATOMY" in contract
    for slot in MAIN_MENU_LEFT_GROUP_ANATOMY:
        assert slot in contract
    for slot in MAIN_MENU_LEFT_ITEM_ANATOMY:
        assert slot in contract


def test_spec_accurate_items_count_matches_contract():
    contract = (REPO_ROOT / "component-contracts/ids/main-menu-left.contract.ts").read_text(
        encoding="utf-8"
    )
    ids_in_contract = re.findall(r'\bid:\s*"([^"]+)"', contract.split("MAIN_MENU_LEFT_SPEC_ACCURATE_ITEMS")[1].split("MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS")[0])
    primary_ids = [item["id"] for item in SPEC_ACCURATE_ITEMS]
    for item_id in primary_ids:
        assert item_id in ids_in_contract
