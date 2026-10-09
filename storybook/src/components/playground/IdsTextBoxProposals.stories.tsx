/**
 * Storybook: the two Text Box / Text Area proposals from the Figma Documentation
 * page (`Storybook-Test`, node `6024-48349`), as decided in the design review and
 * shipped in `lib/react/ids/text-box`.
 *
 *   1. "Change the style of Focus state to be the same as Selected state" —
 *      adopted: click and Tab both give the brand border, with no outer ring.
 *   2. "Select Text when field is in focus" — adopted as a per-field option,
 *      `selectTextOnFocus`, applied the same way to a click and to Tab.
 *
 * Theme: components/ids-theme.css · Layout: ./ids-textbox-proposals.css
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/internal/preview-api";
import "../../../../components/ids-theme.css";
import "./ids-textbox-proposals.css";

import { IdsTextBox } from "@ids/react/text-box";
import { IdsToggleSwitch } from "@ids/react/toggle-switch";

const SAMPLE = "Sample Text";

function Field({
  label,
  selectTextOnFocus,
  area,
  empty,
}: {
  label: string;
  selectTextOnFocus?: boolean;
  area?: boolean;
  empty?: boolean;
}) {
  return (
    <IdsTextBox
      label={label}
      size="small"
      showIcon={false}
      selectTextOnFocus={selectTextOnFocus}
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
          "Both proposals were adopted in the design review. `selectTextOnFocus` only changes " +
          "fields that **already hold text**: a placeholder is not a value, so an empty field puts " +
          "the caret at position 0 either way.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface TryItArgs {
  selectTextOnFocus: boolean;
}

/** Proposal 1 — the focus state is the Selected state. */
export const FocusStateCurrentVsProposed: Story = {
  name: "1. Focus state: same as Selected",
  render: () => (
    <div className="tbp-page">
      <div>
        <h1 className="tbp-title">Focus state: same as Selected</h1>
        <p className="tbp-lede">
          Click a field, then Tab through the rest. Both give the same look, on the text input and
          the text area alike.
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
            <p className="tbp-col__title">Adopted</p>
            <ul className="tbp-list">
              <li>
                Click, label click or Tab → the <strong>Selected</strong> style: brand border
                (<code>--color-border-brand-base</code>), no outer ring.
              </li>
              <li>
                Before the review, Tab kept the neutral border and drew a 1px brand ring outside the
                control, so a tabbed field looked different from a clicked one.
              </li>
              <li>The caret blinks in a focused field either way; that is the browser’s caret.</li>
            </ul>
            <Field label="Input:" empty />
            <Field label="Area:" area empty />
          </div>
        </div>
      </section>
    </div>
  ),
};

/** Proposal 2 — highlight the whole value vs caret at the end. */
export const SelectTextOnFocus: Story = {
  name: "2. Select Text when field is in focus",
  render: () => (
    <div className="tbp-page">
      <div>
        <h1 className="tbp-title">Select Text when field is in focus</h1>
        <p className="tbp-lede">
          Click or Tab into the fields below. <code>selectTextOnFocus</code> decides what happens to
          a value that is already there, and a click behaves the same as Tab. The field never
          brings back a selection made before it lost focus.
        </p>
      </div>

      <section className="tbp-section">
        <div className="tbp-section__head">
          <h2 className="tbp-h">Field that already holds text</h2>
          <p className="tbp-note">This is the only case the option changes.</p>
        </div>
        <div className="tbp-grid">
          <div className="tbp-col">
            <p className="tbp-col__title">Default — highlight the whole text</p>
            <ul className="tbp-list">
              <li>
                Click or Tab in → the <strong>whole value is highlighted</strong>, so typing{" "}
                <strong>replaces</strong> it.
              </li>
              <li>For simple values that are usually re-entered — a name, a location.</li>
              <li>
                <code>selectTextOnFocus</code> (default <code>true</code>). Text Area behaves the
                same as the input.
              </li>
            </ul>
            <Field label="Input:" />
            <Field label="Area:" area />
          </div>
          <div className="tbp-col">
            <p className="tbp-col__title">Opt out — caret at the end</p>
            <ul className="tbp-list">
              <li>
                Click or Tab in → the caret sits <strong>after the last character</strong> and
                nothing is highlighted, so typing <strong>adds to</strong> the value.
              </li>
              <li>
                For important values that are usually edited in part — an IP address, a path — where
                a stray keystroke must not wipe the value.
              </li>
              <li>
                <code>selectTextOnFocus={"{false}"}</code>. Clicking again inside the focused field
                moves the caret as usual.
              </li>
            </ul>
            <Field label="Input:" selectTextOnFocus={false} />
            <Field label="Area:" area selectTextOnFocus={false} />
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
            <Field label="Input:" empty />
            <Field label="Area:" area empty />
          </div>
        </div>
      </section>
    </div>
  ),
};

/** The option on one form, behind a switch — also driven by the `selectTextOnFocus` control. */
export const TryBoth: StoryObj<TryItArgs> = {
  name: "3. Try it",
  args: { selectTextOnFocus: true },
  argTypes: {
    selectTextOnFocus: {
      control: "boolean",
      description:
        "`true`: select the whole value on click or Tab. `false`: put the caret at the end.",
    },
  },
  render: function TryItStory() {
    // The switch and the Controls panel share the one arg, so they never disagree.
    const [{ selectTextOnFocus }, updateArgs] = useArgs<TryItArgs>();
    const setSelectTextOnFocus = (value: boolean) => updateArgs({ selectTextOnFocus: value });

    return (
      <div className="tbp-page">
        <div>
          <h1 className="tbp-title">Try it</h1>
          <p className="tbp-lede">
            Flip the switch (or <code>selectTextOnFocus</code> in Controls), then click or Tab
            through the form. The fields start with text, since
            that is the case the option changes.
          </p>
        </div>

        <section className="tbp-section">
          <div className="tbp-toggles">
            <IdsToggleSwitch
              label="Select Text when field is in focus"
              aria-label="Select Text when field is in focus"
              checked={selectTextOnFocus}
              onCheckedChange={setSelectTextOnFocus}
            />
          </div>

          <div className="tbp-col">
            <Field label="Site:" selectTextOnFocus={selectTextOnFocus} />
            <Field label="Username:" selectTextOnFocus={selectTextOnFocus} />
            <Field label="Note:" area selectTextOnFocus={selectTextOnFocus} />
          </div>
        </section>
      </div>
    );
  },
};
