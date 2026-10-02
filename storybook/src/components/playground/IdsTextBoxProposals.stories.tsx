/**
 * Storybook: the two Text Box / Text Area proposals from the Figma Documentation
 * page (`Storybook-Test`, node `6024-48349`), demoed against the real IDS
 * components so they can be tried in the Friday review.
 *
 *   1. "Select Text when field is in focus" — a per-field option: Tab either
 *      highlights the whole value or puts the caret at the end.
 *   2. "Change the style of Focus state to be the same as Selected state" — drop
 *      the outer focus ring so Tab looks like a click.
 *
 * Proposal 1 ships as a real prop (`selectOnFocus`) because the note asks for an
 * option. Proposal 2 is a story-scoped CSS override, because the note asks to
 * change the style outright — nothing in `lib/` carries it yet.
 *
 * Theme: components/ids-theme.css · Layout: ./ids-textbox-proposals.css
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import "./ids-textbox-proposals.css";

import { IdsTextBox } from "@ids/react/text-box";
import { IdsToggleSwitch } from "@ids/react/toggle-switch";

const SAMPLE = "Sample Text";

function Field({
  label,
  selectOnFocus,
  area,
  empty,
}: {
  label: string;
  selectOnFocus?: boolean;
  area?: boolean;
  empty?: boolean;
}) {
  return (
    <IdsTextBox
      label={label}
      size="small"
      showIcon={false}
      selectOnFocus={selectOnFocus}
      {...(area ? { componentType: "text-area" as const, rows: 3 } : {})}
      {...(empty ? { placeholder: "Placeholder Text" } : { defaultValue: SAMPLE })}
    />
  );
}

const meta: Meta = {
  title: "Playground/Text Box Proposals",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Both proposals only change fields that **already hold text**. A placeholder is not a " +
          "value, so an empty field puts the caret at position 0 either way.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/** Proposal 1 — current focus ring vs the Selected style. */
export const FocusStateCurrentVsProposed: Story = {
  name: "1. Focus state: current vs proposed",
  render: () => (
    <div className="tbp-page">
      <div>
        <h1 className="tbp-title">Focus state: current vs proposed</h1>
        <p className="tbp-lede">
          Tab through the left column, then the right. A click behaves the same in both — it always
          gives the brand border alone.
        </p>
        <p className="tbp-quote" style={{ marginTop: "var(--spacing-space-12)" }}>
          “When the user presses Tab, the text box is in Focus state but with the cursor blinking.
          This does not seem to be a standard behavior.” — Change the style of Focus state to be the
          same as Selected state.
        </p>
      </div>

      <section className="tbp-section">
        <div className="tbp-grid">
          <div className="tbp-col">
            <p className="tbp-col__title">Current</p>
            <ul className="tbp-list">
              <li>
                Click in the field → the <strong>Selected</strong> style: brand border
                (<code>--color-border-brand-base</code>), no ring.
              </li>
              <li>Clicking the label does the same — it is still a pointer.</li>
              <li>
                Tab in → <strong>a different look</strong>: the border stays neutral
                (<code>--color-border-gray-neutral-base</code>) and a 1px brand ring is drawn
                outside the control at <code>inset: −5px</code>.
              </li>
              <li>
                Either way the caret blinks in the field. The note is about the ring, not the caret.
              </li>
            </ul>
            <Field label="Input:" empty />
            <Field label="Area:" area empty />
          </div>
          <div className="tbp-col tbp-as-selected">
            <p className="tbp-col__title">Proposed</p>
            <ul className="tbp-list">
              <li>
                Tab in → the <strong>same Selected style as a click</strong>: brand border, no ring.
              </li>
              <li>Click and label click are untouched.</li>
              <li>
                So a field looks identical whether you clicked it or tabbed to it. The border still
                changes on focus, so there is a visible focus indicator, but the ring is the only
                thing today that tells the two apart.
              </li>
            </ul>
            <Field label="Input:" empty />
            <Field label="Area:" area empty />
          </div>
        </div>
      </section>
    </div>
  ),
};

/** Proposal 2 — caret at the end vs highlight the whole value. */
export const SelectTextOnFocus: Story = {
  name: "2. Select Text when field is in focus",
  render: () => (
    <div className="tbp-page">
      <div>
        <h1 className="tbp-title">Select Text when field is in focus</h1>
        <p className="tbp-lede">
          Tab through the fields below. The design spec has <strong>no rule</strong> for this case —
          it only says keyboard operations “use native input semantics”, so the behaviour is
          whatever the browser does, and every browser highlights the whole value when you Tab into
          a field that already holds text. The proposal turns that into a choice, with the caret at
          the end as the default.
        </p>
      </div>

      <section className="tbp-section">
        <div className="tbp-section__head">
          <h2 className="tbp-h">Field that already holds text</h2>
          <p className="tbp-note">This is the only case either proposal changes.</p>
        </div>
        <div className="tbp-grid">
          <div className="tbp-col">
            <p className="tbp-col__title">Default — caret at the end</p>
            <ul className="tbp-list">
              <li>
                Tab in → the caret sits <strong>after the last character</strong> and nothing is
                highlighted, so typing <strong>adds to</strong> the value.
              </li>
              <li>Click → caret where you clicked, as today.</li>
              <li>Click the label → the caret stays where it already was.</li>
              <li>
                Text Area behaves the same as the input. <code>selectOnFocus={"{false}"}</code> — the
                default, and a <strong>change</strong> from what ships today.
              </li>
            </ul>
            <Field label="Input:" />
            <Field label="Area:" area />
          </div>
          <div className="tbp-col tbp-as-selected">
            <p className="tbp-col__title">Opt in — highlight the whole text</p>
            <ul className="tbp-list">
              <li>
                Tab in → the <strong>whole value is highlighted</strong>, so typing{" "}
                <strong>replaces</strong> it. This is what ships today.
              </li>
              <li>
                Click → still the caret where you clicked. The option only changes keyboard focus.
              </li>
              <li>Text Area behaves the same as the input.</li>
              <li>
                <code>selectOnFocus</code>, shown with the proposed focus style from story 1 so the
                highlight is not competing with an outer ring.
              </li>
            </ul>
            <Field label="Input:" selectOnFocus />
            <Field label="Area:" area selectOnFocus />
          </div>
        </div>
      </section>

      <section className="tbp-section">
        <div className="tbp-section__head">
          <h2 className="tbp-h">Empty field — neither mode applies</h2>
          <p className="tbp-note">
            A placeholder is not a value, so there is nothing to select and the caret sits at
            position 0 whichever way the option is set.
          </p>
        </div>
        <div className="tbp-grid">
          <div className="tbp-col">
            <Field label="Input:" empty selectOnFocus />
            <Field label="Area:" area empty selectOnFocus />
          </div>
        </div>
      </section>
    </div>
  ),
};

/** Both proposals on one form, each behind a switch. */
export const TryBoth: Story = {
  name: "3. Try both",
  render: function TryBothStory() {
    const [selectOnFocus, setSelectOnFocus] = useState(false);
    const [asSelected, setAsSelected] = useState(false);

    return (
      <div className="tbp-page">
        <div>
          <h1 className="tbp-title">Try both</h1>
          <p className="tbp-lede">
            Flip either switch, then Tab through the form. The fields start with text, since that is
            the case the proposals change.
          </p>
        </div>

        <section className="tbp-section">
          <div className="tbp-toggles">
            <IdsToggleSwitch
              label="Select Text when field is in focus"
              aria-label="Select Text when field is in focus"
              checked={selectOnFocus}
              onCheckedChange={setSelectOnFocus}
            />
            <IdsToggleSwitch
              label="Focus state same as Selected state"
              aria-label="Focus state same as Selected state"
              checked={asSelected}
              onCheckedChange={setAsSelected}
            />
          </div>

          <div className={asSelected ? "tbp-col tbp-as-selected" : "tbp-col"}>
            <Field label="Site:" selectOnFocus={selectOnFocus} />
            <Field label="Username:" selectOnFocus={selectOnFocus} />
            <Field label="Note:" area selectOnFocus={selectOnFocus} />
          </div>
        </section>
      </div>
    );
  },
};
