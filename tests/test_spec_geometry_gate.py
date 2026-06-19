from __future__ import annotations

from pathlib import Path

from validation.spec_contract_parser import SpecContractParser

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def test_dropdown_single_select_geometry_gate_passes():
    spec_path = PROJECT_ROOT / "components/ids/dropdown-single-select/design-spec.md"
    text = spec_path.read_text(encoding="utf-8")
    result = SpecContractParser().validate_slot_geometry_gate(text)
    assert result.ok, result.errors


def test_dropdown_multiselect_geometry_gate_passes():
    spec_path = PROJECT_ROOT / "components/ids/dropdown-multiselect/design-spec.md"
    text = spec_path.read_text(encoding="utf-8")
    result = SpecContractParser().validate_slot_geometry_gate(text)
    assert result.ok, result.errors


def test_dropdown_combo_box_geometry_gate_passes():
    spec_path = PROJECT_ROOT / "components/ids/dropdown-combo-box/design-spec.md"
    text = spec_path.read_text(encoding="utf-8")
    result = SpecContractParser().validate_slot_geometry_gate(text)
    assert result.ok, result.errors


def test_missing_geometry_table_fails():
    text = "# Foo\n\n## Layout & Measurements\n- padding only\n"
    result = SpecContractParser().validate_slot_geometry_gate(text)
    assert not result.ok
    assert any("Slot geometry" in err for err in result.errors)
