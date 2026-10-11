/**
 * Storybook: the Dropdown — Single Select keyboard proposal from the Figma
 * Documentation page, as decided in the design review and shipped in
 * `lib/react/ids/dropdown-shared/DropdownMenu.tsx` (single select, and the combo
 * box in single mode).
 *
 * Adopted:
 *   - Tab onto the trigger shows the focus state; it does not open the menu
 *   - Enter or Space open the menu with the selected item focused
 *   - Inside the menu, Down/Up move focus and WRAP at both ends; focus never
 *     changes the value, and the selected item stays highlighted in blue
 *   - Enter selects the focused item, closes the menu and returns focus to the
 *     trigger
 *   - Tab / Shift+Tab close the menu, keep the value and move to the next /
 *     previous component on the form
 *   - Escape closes the menu and returns focus to the trigger
 *
 * On hold, pending the accessibility review: Down/Up on a CLOSED trigger stepping
 * the value in place (100% -> 110% / 90%). `StepValueSingleSelect` layers that one
 * behaviour onto the shipped component from the outside so it can still be tried —
 * nothing in `lib/` changes.
 *
 * Theme: components/ids-theme.css · Layout: ./ids-textbox-proposals.css
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import "./ids-textbox-proposals.css";

import {
  IdsDropdownSingleSelect,
  type IdsDropdownSingleSelectOptionModel,
} from "@ids/react/dropdown-single-select";
import { IdsTextBox } from "@ids/react/text-box";

const ZOOM_OPTIONS: IdsDropdownSingleSelectOptionModel[] = [
  { id: "75", label: "75%" },
  { id: "90", label: "90%" },
  { id: "100", label: "100%" },
  { id: "110", label: "110%" },
  { id: "125", label: "125%" },
  { id: "150", label: "150%" },
];

interface ZoomSelectProps {
  options: IdsDropdownSingleSelectOptionModel[];
  value: string;
  onChange: (next: string) => void;
  label: string;
}

function ShippedSingleSelect({ options, value, onChange, label }: ZoomSelectProps) {
  return (
    <IdsDropdownSingleSelect
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      menuWidth="trigger"
      fullWidth
    />
  );
}

/**
 * The part still on hold: Down/Up on a closed trigger step the value instead of
 * opening the menu. The capture handler runs before the trigger's own key
 * handling, so stopping the event here keeps the menu shut. Once the menu is
 * open, the arrows are left to the shipped component.
 */
function StepValueSingleSelect({ options, value, onChange, label }: ZoomSelectProps) {
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

  return (
    <div onKeyDownCapture={handleCapture}>
      <ShippedSingleSelect label={label} options={options} value={value} onChange={onChange} />
    </div>
  );
}

const meta: Meta = {
  title: "Playground/Dropdown Proposals",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Single Select keyboard model from the Figma Documentation page, as adopted in the " +
          "design review. Stepping the value with Down/Up on a closed trigger is on hold pending " +
          "the accessibility review.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/** The adopted keyboard model, next to the one part still on hold. */
export const KeyboardCurrentVsProposed: Story = {
  name: "1. Single Select keyboard",
  render: function KeyboardStory() {
    const [shipped, setShipped] = useState("100");
    const [stepped, setStepped] = useState("100");

    return (
      <div className="tbp-page">
        <div>
          <h1 className="tbp-title">Single Select keyboard</h1>
          <p className="tbp-lede">
            Adopted in the design review. Tab into the dropdown, press Enter, move with Down and
            Up, then press Enter to pick a value or Tab to move on without changing it.
          </p>
        </div>

        <section className="tbp-section">
          <div className="tbp-grid">
            <div className="tbp-col">
              <p className="tbp-col__title">Adopted — ships today</p>
              <ul className="tbp-list">
                <li>Tab onto the trigger shows the focus state; the menu stays shut.</li>
                <li>
                  Enter or Space open the menu with the <strong>selected row focused</strong>.
                </li>
                <li>
                  Inside the menu, Down/Up move focus and <strong>wrap</strong> from the last row
                  to the first. Moving focus does not change the value.
                </li>
                <li>
                  Enter selects the focused row, closes the menu and{" "}
                  <strong>returns focus to the trigger</strong>, so the next Tab carries on from
                  there.
                </li>
                <li>
                  Tab or Shift+Tab <strong>close the menu</strong>, keep the value and move to the
                  next or previous field.
                </li>
                <li>Escape closes the menu and returns focus to the trigger.</li>
              </ul>
              <ShippedSingleSelect
                label="Zoom:"
                options={ZOOM_OPTIONS}
                value={shipped}
                onChange={setShipped}
              />
              <p className="tbp-note">
                Value: <strong>{shipped}%</strong>
              </p>
              <IdsTextBox label="Next field:" size="small" showIcon={false} />
            </div>

            <div className="tbp-col">
              <p className="tbp-col__title">On hold — step the value on a closed trigger</p>
              <p className="tbp-quote">
                “While the dropdown is in focus, press down arrow key will display the next item in
                the dropdown menu, i.e. 110% and the dropdown remains in Focus state. Pressing up
                arrow key will display 90%.”
              </p>
              <ul className="tbp-list">
                <li>
                  Here, Down/Up on a closed trigger <strong>step the value</strong> and the menu
                  stays shut. Everything else is the same as on the left.
                </li>
                <li>
                  Pending the accessibility review, so it is not in <code>lib/</code>. On the left,
                  Down on a closed trigger opens the menu with focus still on the trigger — a
                  second press moves it onto the selected row — and Up does nothing.
                </li>
              </ul>
              <StepValueSingleSelect
                label="Zoom:"
                options={ZOOM_OPTIONS}
                value={stepped}
                onChange={setStepped}
              />
              <p className="tbp-note">
                Value: <strong>{stepped}%</strong>
              </p>
              <IdsTextBox label="Next field:" size="small" showIcon={false} />
            </div>
          </div>
        </section>

        <section className="tbp-section">
          <div className="tbp-section__head">
            <h2 className="tbp-h">The same in both columns</h2>
            <ul className="tbp-list">
              <li>
                The selected row keeps its blue background while another row is focused; the focused
                row is marked by its focus ring, not by a background.
              </li>
              <li>
                Opening the menu with the mouse leaves focus on the trigger; Enter, Space, Down or Up
                then move it onto the selected row.
              </li>
            </ul>
          </div>
        </section>
      </div>
    );
  },
};
