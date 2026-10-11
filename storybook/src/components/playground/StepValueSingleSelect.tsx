/**
 * Playground-only: `IdsDropdownSingleSelect` with the Single Select keyboard
 * behaviour that is still on hold pending the accessibility review — Down/Up on a
 * CLOSED trigger step the value in place (100% -> 110% / 90%) instead of opening
 * the menu. Everything else is the shipped component; nothing in `lib/` changes.
 *
 * Used by the Settings page.
 */
import React from "react";
import {
  IdsDropdownSingleSelect,
  type IdsDropdownSingleSelectProps,
} from "@ids/react/dropdown-single-select";

export type StepValueSingleSelectProps = IdsDropdownSingleSelectProps & {
  /** Controlled only: the arrow keys step from the current value. */
  value: string;
  onChange: (value: string) => void;
};

export function StepValueSingleSelect(props: StepValueSingleSelectProps) {
  const { options = [], value, onChange } = props;

  // Capture phase runs before the trigger's own key handling, so stopping the
  // event here keeps the menu shut. Once the menu is open, the arrows are left to
  // the shipped component.
  const handleCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const target = event.target as HTMLElement | null;
    if (target?.getAttribute("role") !== "combobox") return;
    if (target.getAttribute("aria-expanded") === "true") return;
    event.preventDefault();
    event.stopPropagation();
    const pickable = options.filter(
      (option) => !option.disabled && option.kind !== "section" && option.kind !== "divider",
    );
    const index = pickable.findIndex((option) => option.id === value);
    const next = pickable[index + (event.key === "ArrowDown" ? 1 : -1)];
    if (next) onChange(next.id);
  };

  // `display: contents` keeps the wrapper out of layout, so the dropdown sizes
  // against its real parent exactly as it would unwrapped.
  return (
    <div style={{ display: "contents" }} onKeyDownCapture={handleCapture}>
      <IdsDropdownSingleSelect {...props} />
    </div>
  );
}
