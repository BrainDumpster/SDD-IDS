"""Derive implementation artifacts from `design-spec.md` text (deterministic codegen)."""

from generation.spec_derived.main_menu_left_composition import (
    MAIN_MENU_LEFT_COMPOSITION_ANATOMY,
    MAIN_MENU_LEFT_GROUP_ANATOMY,
    MAIN_MENU_LEFT_ITEM_ANATOMY,
    emit_angular_composition_root,
    emit_angular_menu_list,
    emit_react_menu_list,
)

__all__ = [
    "MAIN_MENU_LEFT_COMPOSITION_ANATOMY",
    "MAIN_MENU_LEFT_GROUP_ANATOMY",
    "MAIN_MENU_LEFT_ITEM_ANATOMY",
    "emit_angular_composition_root",
    "emit_angular_menu_list",
    "emit_react_menu_list",
]
