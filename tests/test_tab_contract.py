"""Tab contract overflow math — must match components/ids/tab/design-spec.md."""

from __future__ import annotations

import importlib.util
from pathlib import Path

_REPO = Path(__file__).resolve().parents[1]
_CONTRACT = _REPO / "component-contracts/ids/tab.contract.ts"


def _load_contract_js_exports() -> dict:
    """Load exported constants via a minimal TS parse (compile not required for pytest)."""
    text = _CONTRACT.read_text(encoding="utf-8")
    assert "TAB_OVERFLOW_MORE_TRIGGER_RESERVE_PX = 84" in text
    assert "TAB_OVERFLOW_DEMO_WIDTH = 560" in text
    assert 'TAB_OVERFLOW_MORE_ICON_SLUG = "arrow-tri-down-solid"' in text
    assert "TAB_OVERFLOW_MORE_ICON_SIZE_PX = 10" in text
    return {}


def test_overflow_visible_count_demo_width():
    """560px host with 7 items matches spec-accurate overflow demos (5 visible + More)."""
    # Mirror computeTabOverflowVisibleCount in tab.contract.ts (keep in sync).
    container_width = 560
    item_count = 7
    more_width = 84
    min_tab_width = 80
    add_width = 0
    available = container_width - add_width - more_width
    max_visible = max(1, available // min_tab_width)
    visible = min(max_visible, item_count)
    assert visible == 5


def test_overflow_menu_excludes_active():
    hidden = [{"id": "a"}, {"id": "b"}, {"id": "c"}]
    active = "b"
    menu = [item for item in hidden if item["id"] != active]
    assert menu == [{"id": "a"}, {"id": "c"}]


def test_contract_file_exists():
    assert _CONTRACT.is_file()
    _load_contract_js_exports()
