from __future__ import annotations

from pathlib import Path
from typing import Callable, Dict, Tuple

from generation.deterministic_storybook.ids.about import generate_ids_about_story
from generation.deterministic_storybook.ids.accordion import generate_ids_accordion_story
from generation.deterministic_storybook.powerflex.button_dropdown import (
    generate_powerflex_button_dropdown_story,
)
from generation.deterministic_storybook.powerflex.select import (
    generate_powerflex_select_story,
)
from generation.deterministic_storybook.ids.alert import generate_ids_alert_story
from generation.deterministic_storybook.ids.anchor_menu import generate_ids_anchor_menu_story
from generation.deterministic_storybook.ids.app_launcher import generate_ids_app_launcher_story
from generation.deterministic_storybook.ids.badge import generate_ids_badge_story
from generation.deterministic_storybook.ids.button import generate_ids_button_story
from generation.deterministic_storybook.ids.card import generate_ids_card_story
from generation.deterministic_storybook.ids.checkbox import generate_ids_checkbox_story
from generation.deterministic_storybook.ids.dashboard import generate_ids_dashboard_story
from generation.deterministic_storybook.ids.datagrid import generate_ids_datagrid_story
from generation.deterministic_storybook.ids.date_picker import generate_ids_date_picker_story
from generation.deterministic_storybook.ids.detail_panel import generate_ids_detail_panel_story
from generation.deterministic_storybook.ids.dropdown_combo_box import generate_ids_dropdown_combo_box_story
from generation.deterministic_storybook.ids.dropdown_multiselect import generate_ids_dropdown_multiselect_story
from generation.deterministic_storybook.ids.dropdown_single_select import (
    generate_ids_dropdown_single_select_story,
)
from generation.deterministic_storybook.ids.dual_list_box import generate_ids_dual_list_box_story
from generation.deterministic_storybook.ids.footer import generate_ids_footer_story
from generation.deterministic_storybook.ids.link import generate_ids_link_story
from generation.deterministic_storybook.ids.main_menu_left import generate_ids_main_menu_left_story
from generation.deterministic_storybook.ids.main_menu_top import generate_ids_main_menu_top_story
from generation.deterministic_storybook.ids.masthead import generate_ids_masthead_story
from generation.deterministic_storybook.ids.masthead_dap import generate_dap_masthead_story
from generation.deterministic_storybook.ids.modal import generate_ids_modal_story
from generation.deterministic_storybook.ids.pagination import generate_ids_pagination_story
from generation.deterministic_storybook.ids.settings_menu_dap import generate_dap_settings_menu_story
from generation.deterministic_storybook.ids.side_panel_dap import generate_dap_side_panel_story
from generation.deterministic_storybook.ids.progress_bar import generate_ids_progress_bar_story
from generation.deterministic_storybook.ids.radio_button import generate_ids_radio_button_story
from generation.deterministic_storybook.ids.scroll_bar import generate_ids_scroll_bar_story
from generation.deterministic_storybook.ids.segmented_button import generate_ids_segmented_button_story
from generation.deterministic_storybook.ids.slider import generate_ids_slider_story
from generation.deterministic_storybook.ids.spinner import generate_ids_spinner_story
from generation.deterministic_storybook.ids.status_bar import generate_ids_status_bar_story
from generation.deterministic_storybook.ids.tab import generate_ids_tab_story
from generation.deterministic_storybook.ids.tag import generate_ids_tag_story
from generation.deterministic_storybook.ids.text_box import generate_ids_text_box_story
from generation.deterministic_storybook.ids.time_picker import generate_ids_time_picker_story
from generation.deterministic_storybook.ids.toggle_switch import generate_ids_toggle_switch_story
from generation.deterministic_storybook.ids.toast import generate_ids_toast_story
from generation.deterministic_storybook.ids.tooltip import generate_ids_tooltip_story
from generation.deterministic_storybook.ids.tree import generate_ids_tree_story
from generation.deterministic_storybook.ids.wizard import generate_ids_wizard_story
from generation.deterministic_storybook.ids.wizard_inline import generate_ids_wizard_inline_story
from generation.deterministic_storybook.ids.wizard_modal import generate_ids_wizard_modal_story
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract

StoryGenerator = Callable[..., str]


REGISTRY: Dict[Tuple[str, str], StoryGenerator] = {
    ("ids", "about"): generate_ids_about_story,
    ("ids", "accordion"): generate_ids_accordion_story,
    ("powerflex", "accordion"): generate_ids_accordion_story,
    ("powerflex", "button-dropdown"): generate_powerflex_button_dropdown_story,
    ("powerflex", "select"): generate_powerflex_select_story,
    ("ids", "alert"): generate_ids_alert_story,
    ("ids", "anchor-menu"): generate_ids_anchor_menu_story,
    ("ids", "app-launcher"): generate_ids_app_launcher_story,
    ("ids", "badge"): generate_ids_badge_story,
    ("ids", "button"): generate_ids_button_story,
    ("ids", "card"): generate_ids_card_story,
    ("ids", "checkbox"): generate_ids_checkbox_story,
    ("ids", "dashboard"): generate_ids_dashboard_story,
    ("ids", "datagrid"): generate_ids_datagrid_story,
    ("ids", "date-picker"): generate_ids_date_picker_story,
    ("ids", "detail-panel"): generate_ids_detail_panel_story,
    ("ids", "dropdown-combo-box"): generate_ids_dropdown_combo_box_story,
    ("ids", "dropdown-multiselect"): generate_ids_dropdown_multiselect_story,
    ("ids", "dropdown-single-select"): generate_ids_dropdown_single_select_story,
    ("ids", "dual-list-box"): generate_ids_dual_list_box_story,
    ("ids", "footer"): generate_ids_footer_story,
    ("ids", "link"): generate_ids_link_story,
    ("ids", "main-menu-left"): generate_ids_main_menu_left_story,
    ("ids", "main-menu-top"): generate_ids_main_menu_top_story,
    ("ids", "masthead"): generate_ids_masthead_story,
    ("ids", "modal"): generate_ids_modal_story,
    ("ids", "pagination"): generate_ids_pagination_story,
    ("ids", "progress-bar"): generate_ids_progress_bar_story,
    ("ids", "progressbar"): generate_ids_progress_bar_story,
    ("ids", "radio-button"): generate_ids_radio_button_story,
    ("ids", "radiobutton"): generate_ids_radio_button_story,
    ("ids", "scroll-bar"): generate_ids_scroll_bar_story,
    ("ids", "scrollbar"): generate_ids_scroll_bar_story,
    ("ids", "segmented-button"): generate_ids_segmented_button_story,
    ("ids", "slider"): generate_ids_slider_story,
    ("ids", "spinner"): generate_ids_spinner_story,
    ("ids", "status-bar"): generate_ids_status_bar_story,
    ("ids", "tab"): generate_ids_tab_story,
    ("ids", "tabs"): generate_ids_tab_story,
    ("ids", "tag"): generate_ids_tag_story,
    ("ids", "text-box"): generate_ids_text_box_story,
    ("ids", "textbox"): generate_ids_text_box_story,
    ("ids", "time-picker"): generate_ids_time_picker_story,
    ("ids", "toggle-switch"): generate_ids_toggle_switch_story,
    ("ids", "toggleswitch"): generate_ids_toggle_switch_story,
    ("ids", "toast"): generate_ids_toast_story,
    ("ids", "tooltip"): generate_ids_tooltip_story,
    ("ids", "tree"): generate_ids_tree_story,
    ("ids", "dialog"): generate_ids_modal_story,
    ("ids", "wizard"): generate_ids_wizard_story,
    ("ids", "wizard-inline"): generate_ids_wizard_inline_story,
    ("ids", "wizard-modal"): generate_ids_wizard_modal_story,
    # DAP-only slugs (resolved via ("ids", slug) fallback when design system is `dap`)
    ("ids", "masthead-dap"): generate_dap_masthead_story,
    ("ids", "settings-menu"): generate_dap_settings_menu_story,
    ("ids", "side-panel"): generate_dap_side_panel_story,
}


def generate_story_for_component(
    *,
    design_system: str,
    component: str,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: DeterministicStorybookOptions | None = None,
) -> str | None:
    key = (design_system.lower(), component.lower())
    generator = REGISTRY.get(key)
    if not generator:
        # Allow baseline IDS generator reuse in program contexts.
        generator = REGISTRY.get(("ids", component.lower()))
    if not generator:
        return None
    return generator(
        repo_root=repo_root,
        story_path=story_path,
        contract=contract,
        options=options,
    )
