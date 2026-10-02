/**
 * Storybook: the Dropdown — Single Select proposal from the Figma Documentation
 * page, demoed against the real `IdsDropdownSingleSelect` so it can be tried in
 * the Friday review.
 *
 * Proposed keyboard model:
 *   - Tab into the dropdown shows the focus state
 *   - While focused and CLOSED, Down/Up change the value in place (100% -> 110% /
 *     90%); the menu does not open and the trigger keeps its focus state
 *   - Enter or Space opens the menu with the selected item focus-selected
 *   - Inside the menu, Down/Up move focus and WRAP at both ends; the selected item
 *     stays highlighted in blue
 *   - Enter selects the focused item, closes the menu and puts it in the trigger
 *   - Tab closes the menu and moves to the next component on the form
 *
 * `ProposedSingleSelect` layers the divergences onto the shipped component from
 * the outside — nothing in `lib/` changes. React routes portal events through the
 * React tree, so one capture handler on the wrapper sees both the trigger and the
 * portaled popup.
 *
 * Measured against what ships today, the proposal changes four things: the arrow
 * keys on a closed trigger, where focus lands when the menu opens, whether the
 * arrows wrap at the ends, and what Tab does while the menu is open.
 *
 * Theme: components/ids-theme.css · Layout: ./ids-textbox-proposals.css
 */
import React, { useRef, useState } from "react";
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

const SELECTABLE = '[data-selectable="true"]';

function ProposedSingleSelect({
  options,
  value,
  onChange,
  label,
}: {
  options: IdsDropdownSingleSelectOptionModel[];
  value: string;
  onChange: (next: string) => void;
  label: string;
}) {
  const openRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const focusSelectedOnOpenRef = useRef(false);

  /**
   * Enter / Space open the menu with the selected row focus-selected.
   *
   * The popup portals in a frame or two after `onOpenChange`, and the first open
   * of the session is slow enough to miss a single frame — the rows were not in
   * the DOM yet, so focus stayed on the trigger and the proposal looked exactly
   * like today's behaviour until you opened it a second time. Keep looking until
   * the rows exist, and only take focus if it is still on the trigger or inside
   * the menu.
   */
  const focusSelectedRow = (attempt = 0) => {
    const popup = document.querySelector<HTMLElement>('[role="listbox"]');
    const rows = popup ? Array.from(popup.querySelectorAll<HTMLElement>(SELECTABLE)) : [];
    if (rows.length === 0) {
      if (attempt < 20) requestAnimationFrame(() => focusSelectedRow(attempt + 1));
      return;
    }
    const active = document.activeElement;
    const stillHere =
      !active || rootRef.current?.contains(active) || popup?.contains(active) || active === document.body;
    if (!stillHere) return;
    const target = rows.find((row) => row.getAttribute("aria-checked") === "true") ?? rows[0];
    target?.focus();
  };

  const handleCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      (event.key === "Enter" || event.key === " " || event.key === "Spacebar") &&
      !openRef.current &&
      (event.target as HTMLElement | null)?.getAttribute("role") === "combobox"
    ) {
      // Let the component open it, then put focus on the selected row.
      focusSelectedOnOpenRef.current = true;
      return;
    }
    /* Tab closes the menu and continues the form, rather than stepping through the
       popup's own controls. Moving focus out is what closes it — MenuPopup closes
       on focusout. */
    if (event.key === "Tab" && openRef.current) {
      const trigger = rootRef.current?.querySelector<HTMLElement>('[role="combobox"]');
      const popup = document.querySelector<HTMLElement>('[role="listbox"]');
      if (!trigger) return;
      const pageFocusables = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !popup?.contains(element) && element.offsetParent !== null);
      const index = pageFocusables.indexOf(trigger);
      const next = pageFocusables[index + (event.shiftKey ? -1 : 1)];
      event.preventDefault();
      event.stopPropagation();
      (next ?? trigger).focus();
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const dir = event.key === "ArrowDown" ? 1 : -1;
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const popup = target.closest<HTMLElement>('[role="listbox"]');

    // Focus is on the trigger. While closed, step the value instead of opening.
    if (!popup) {
      if (openRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      const pickable = options.filter((option) => !option.disabled && !option.kind);
      const index = pickable.findIndex((option) => option.id === value);
      const next = pickable[index + dir];
      if (next) onChange(next.id);
      return;
    }

    // Inside the menu: the shipped handler stops at the ends, the proposal wraps.
    const rows = Array.from(popup.querySelectorAll<HTMLElement>(SELECTABLE)).filter(
      (row) => !row.hasAttribute("disabled"),
    );
    const current = target.closest<HTMLElement>(SELECTABLE);
    const index = current ? rows.indexOf(current) : -1;
    if (index === -1) return;
    const atEnd = dir > 0 && index === rows.length - 1;
    const atStart = dir < 0 && index === 0;
    if (!atEnd && !atStart) return;
    event.preventDefault();
    event.stopPropagation();
    (atEnd ? rows[0] : rows[rows.length - 1]).focus();
  };

  return (
    <div ref={rootRef} onKeyDownCapture={handleCapture}>
      <IdsDropdownSingleSelect
        label={label}
        options={options}
        value={value}
        onChange={onChange}
        onOpenChange={(open) => {
          openRef.current = open;
          if (!open) {
            focusSelectedOnOpenRef.current = false;
            return;
          }
          if (!focusSelectedOnOpenRef.current) return;
          focusSelectedOnOpenRef.current = false;
          // The popup portals in after this commit; `focusSelectedRow` waits for it.
          requestAnimationFrame(() => focusSelectedRow());
        }}
        menuWidth="trigger"
        fullWidth
      />
    </div>
  );
}

function CurrentSingleSelect({
  options,
  value,
  onChange,
  label,
}: {
  options: IdsDropdownSingleSelectOptionModel[];
  value: string;
  onChange: (next: string) => void;
  label: string;
}) {
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

const meta: Meta = {
  title: "Playground/Dropdown Proposals",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Single Select keyboard model from the Figma Documentation page, next to what ships today.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/** Current vs proposed, side by side. */
export const KeyboardCurrentVsProposed: Story = {
  name: "1. Keyboard: current vs proposed",
  render: function KeyboardStory() {
    const [current, setCurrent] = useState("100");
    const [proposed, setProposed] = useState("100");

    return (
      <div className="tbp-page">
        <div>
          <h1 className="tbp-title">Single Select keyboard: current vs proposed</h1>
          <p className="tbp-lede">
            Tab into each dropdown, then press Down and Up without opening it. On the left the menu
            opens; on the right the value steps in place, which is what the note proposes.
          </p>
          <p className="tbp-quote" style={{ marginTop: "var(--spacing-space-12)" }}>
            “While the dropdown is in focus, press down arrow key will display the next item in the
            dropdown menu, i.e. 110% and the dropdown remains in Focus state. Pressing up arrow key
            will display 90%.”
          </p>
        </div>

        <section className="tbp-section">
          <div className="tbp-grid">
            <div className="tbp-col">
              <p className="tbp-col__title">Current</p>
              <ul className="tbp-list">
                <li>
                  Down/Up on a closed trigger <strong>open the menu</strong>, but focus stays on the
                  trigger — a second press is what moves it onto the selected row.
                </li>
                <li>
                  Enter or Space <strong>open the menu and leave focus on the trigger</strong>, so
                  nothing in the list is focused yet.
                </li>
                <li>Inside the menu, Down/Up <strong>stop</strong> at the first and last row.</li>
                <li>
                  Tab <strong>steps into the list</strong> row by row, starting at the first row
                  rather than the selected one. It only leaves the menu <strong>after the last
                  row</strong>: with these six options that is seven Tabs — 75%, 90%, 100%, 110%,
                  125%, 150%, and the seventh closes the menu and lands on Next field. Tabbing over
                  a row does not pick it, so the value is still the one you started with.
                </li>
              </ul>
              <CurrentSingleSelect
                label="Zoom:"
                options={ZOOM_OPTIONS}
                value={current}
                onChange={setCurrent}
              />
              <p className="tbp-note">
                Value: <strong>{current}%</strong>
              </p>
              <IdsTextBox label="Next field:" size="small" showIcon={false} />
            </div>

            <div className="tbp-col">
              <p className="tbp-col__title">Proposed</p>
              <ul className="tbp-list">
                <li>
                  Down/Up on a closed trigger <strong>step the value</strong> and the menu stays
                  shut.
                </li>
                <li>
                  Enter or Space open the menu with the{" "}
                  <strong>selected row already focused</strong>.
                </li>
                <li>Inside the menu, Down/Up <strong>wrap</strong> from the last row to the first.</li>
                <li>
                  Tab <strong>closes the menu</strong> and moves to the next field.
                </li>
              </ul>
              <ProposedSingleSelect
                label="Zoom:"
                options={ZOOM_OPTIONS}
                value={proposed}
                onChange={setProposed}
              />
              <p className="tbp-note">
                Value: <strong>{proposed}%</strong>
              </p>
              <IdsTextBox label="Next field:" size="small" showIcon={false} />
            </div>
          </div>
        </section>

        <section className="tbp-section">
          <div className="tbp-section__head">
            <h2 className="tbp-h">The same in both columns</h2>
            <ul className="tbp-list">
              <li>Tab onto a closed trigger shows the focus state.</li>
              <li>
                Enter on a focused row selects it, closes the menu and puts the value in the
                trigger.
              </li>
              <li>
                The selected row keeps its blue background while another row is focused; the focused
                row is marked by its focus ring, not by a background.
              </li>
              <li>
                After Enter selects a row, focus drops to the page body rather than returning to the
                trigger, so the next Tab restarts from the top of the page. That is a gap in what
                ships today — the proposal does not address it, and the keyboard pattern for a
                combobox says focus should go back to the trigger.
              </li>
            </ul>
          </div>
        </section>
      </div>
    );
  },
};
