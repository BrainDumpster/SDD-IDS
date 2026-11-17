/**
 * Storybook: IDS Lit Text Box — composition via `ids-textbox-container`
 * + shared `ids-control-helper` / `ids-control-error`.
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/text-box/design-spec.md
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/text-box/register.js";
import "@ids/core/control/register.js";
import { TEXT_BOX_SPEC_ACCURATE_DEFAULTS } from "@ids/core/text-box";
import {
  TEXT_BOX_DOCS_DESCRIPTION,
  TEXT_BOX_SOURCE_CODE,
  TEXT_BOX_STORY_SOURCE_CODE,
} from "./ids-text-box.developer-usage";

type TextBoxArgs = {
  componentType: "text-input" | "text-area";
  size: "large" | "small";
  state: "default" | "hover" | "selected" | "focus" | "disabled" | "error";
  label: string;
  showLabel: boolean;
  labelPosition: "left" | "top";
  required: boolean;
  placeholder: string;
  value: string;
  disabled: boolean;
  invalid: boolean;
  helperText: string;
  errorText: string;
  showIcon: boolean;
  iconName: string;
  showInfoIcon: boolean;
  selectTextOnFocus: boolean;
};

const meta: Meta<TextBoxArgs> = {
  title: "Spec Generated/IDS/Text Box",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: { component: TEXT_BOX_DOCS_DESCRIPTION },
      source: { code: TEXT_BOX_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    componentType: { control: "select", options: ["text-input", "text-area"] },
    size: { control: "select", options: ["large", "small"] },
    state: {
      control: "select",
      options: ["default", "hover", "selected", "focus", "disabled", "error"],
    },
    label: { control: "text" },
    showLabel: { control: "boolean" },
    labelPosition: { control: "select", options: ["left", "top"] },
    required: { control: "boolean" },
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    helperText: { control: "text" },
    errorText: { control: "text" },
    showIcon: { control: "boolean" },
    iconName: { control: "text" },
    showInfoIcon: { control: "boolean" },
    selectTextOnFocus: { control: "boolean" },
  },
  args: {
    componentType: TEXT_BOX_SPEC_ACCURATE_DEFAULTS.componentType,
    size: TEXT_BOX_SPEC_ACCURATE_DEFAULTS.size,
    state: TEXT_BOX_SPEC_ACCURATE_DEFAULTS.state,
    label: "Label:",
    showLabel: true,
    labelPosition: TEXT_BOX_SPEC_ACCURATE_DEFAULTS.labelPosition,
    required: false,
    placeholder: TEXT_BOX_SPEC_ACCURATE_DEFAULTS.placeholder,
    value: "",
    disabled: false,
    invalid: false,
    helperText: TEXT_BOX_SPEC_ACCURATE_DEFAULTS.helperText,
    errorText: TEXT_BOX_SPEC_ACCURATE_DEFAULTS.errorText,
    showIcon: TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showIcon,
    iconName: TEXT_BOX_SPEC_ACCURATE_DEFAULTS.iconName,
    showInfoIcon: false,
    selectTextOnFocus: true,
  },
};

export default meta;
type Story = StoryObj<TextBoxArgs>;

function composedField(args: TextBoxArgs, onValueChange?: (next: string) => void) {
  const showError = Boolean(args.invalid || args.state === "error");
  const forceDisabled = Boolean(args.disabled || args.state === "disabled");
  const demoState =
    args.state === "disabled" || args.state === "error" ? "default" : args.state;

  return html`
    <div style="width: 300px; max-width: 100%;">
      <ids-textbox-container
        ?error=${showError}
        ?invalid=${args.invalid}
        ?disabled=${forceDisabled}
        ?required=${args.required}
        labelposition=${args.labelPosition}
        size=${args.size}
        ?showinfoicon=${args.showInfoIcon}
        showlabel=${args.showLabel ? "true" : "false"}
      >
        ${args.showLabel ? html`<label>${args.label}</label>` : html``}
        <ids-text-box
          componenttype=${args.componentType}
          size=${args.size}
          state=${demoState}
          placeholder=${args.placeholder}
          .value=${args.value}
          showicon=${args.showIcon ? "true" : "false"}
          iconname=${args.iconName}
          selecttextonfocus=${args.selectTextOnFocus ? "true" : "false"}
          @value-change=${(event: CustomEvent<string>) => {
            onValueChange?.(event.detail);
          }}
        ></ids-text-box>
        <ids-control-helper>${args.helperText}</ids-control-helper>
        <ids-control-error>${args.errorText}</ids-control-error>
      </ids-textbox-container>
    </div>
  `;
}

/** Spec Accurate Design — composed container + helper. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  parameters: {
    docs: {
      description: {
        story:
          "Preferred composition: ids-textbox-container + label + ids-text-box + ids-control-helper / ids-control-error.",
      },
      source: { code: TEXT_BOX_STORY_SOURCE_CODE, language: "html" },
    },
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return composedField(args, (next) => updateArgs({ value: next }));
  },
};

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => html`
    <div
      style="
        display: grid;
        grid-template-columns: repeat(2, minmax(280px, 300px));
        gap: 16px;
      "
    >
      ${(["default", "hover", "selected", "focus"] as const).map(
        (state) => html`
          <ids-textbox-container>
            <ids-text-box
              state=${state}
              value="Filled Text"
              showicon="true"
            ></ids-text-box>
            <ids-control-helper>Helper text</ids-control-helper>
            <ids-control-error>Error message</ids-control-error>
          </ids-textbox-container>
        `,
      )}
      <ids-textbox-container disabled>
        <ids-text-box value="Filled Text"></ids-text-box>
        <ids-control-helper>Helper text</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
      <ids-textbox-container error>
        <ids-text-box placeholder="Placeholder Text"></ids-text-box>
        <ids-control-helper>Helper text</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
    </div>
  `,
};

export const ErrorShowsErrorSlot: Story = {
  name: "Error Shows Error Slot",
  parameters: {
    docs: {
      description: {
        story:
          "Toggle `invalid` / `error` on the container: helper hides and `ids-control-error` appears.",
      },
    },
  },
  args: { invalid: true, label: "Username:", required: true, value: "User12345" },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return html`
      <div style="display: grid; gap: 16px; width: 300px;">
        <label style="font-size: 12px; color: var(--color-text-gray-neutral);">
          <input
            type="checkbox"
            .checked=${args.invalid}
            @change=${(event: Event) => {
              updateArgs({ invalid: (event.target as HTMLInputElement).checked });
            }}
          />
          invalid / show error slot
        </label>
        ${composedField(args, (next) => updateArgs({ value: next }))}
      </div>
    `;
  },
};

export const TextAreaVariants: Story = {
  name: "Text Area Variants",
  render: () => html`
    <div style="display: grid; gap: 16px; max-width: 300px;">
      <ids-textbox-container>
        <ids-text-box
          componenttype="text-area"
          placeholder="Default text-area"
        ></ids-text-box>
        <ids-control-helper>Helper text</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
      <ids-textbox-container error>
        <ids-text-box
          componenttype="text-area"
          placeholder="Error text-area"
        ></ids-text-box>
        <ids-control-helper>Helper text</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
    </div>
  `,
};

export const SizeScale: Story = {
  name: "Size Scale",
  render: () => html`
    <div style="display: grid; gap: 16px; max-width: 300px;">
      <ids-textbox-container size="large">
        <label>Large:</label>
        <ids-text-box size="large" placeholder="Large (40)"></ids-text-box>
        <ids-control-helper>Helper text</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
      <ids-textbox-container size="small">
        <label>Small:</label>
        <ids-text-box size="small" placeholder="Small (32)"></ids-text-box>
        <ids-control-helper>Helper text</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
    </div>
  `,
};

export const WithLabelAndRequired: Story = {
  name: "With Label And Required",
  render: () => html`
    <div style="display: grid; gap: 16px; max-width: 420px;">
      <ids-textbox-container>
        <label>Label:</label>
        <ids-text-box placeholder="Placeholder Text"></ids-text-box>
        <ids-control-helper>Helper text</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
      <ids-textbox-container required>
        <label>Label:</label>
        <ids-text-box placeholder="Placeholder Text"></ids-text-box>
        <ids-control-helper>Helper text</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
    </div>
  `,
};

export const LabelPositionTop: Story = {
  name: "Label Position: Top",
  render: () => html`
    <div style="display: grid; gap: 16px; width: 300px;">
      <ids-textbox-container labelposition="top">
        <label>Label:</label>
        <ids-text-box placeholder="Top label"></ids-text-box>
        <ids-control-helper>Helper text</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
    </div>
  `,
};

export const SelectTextOnFocus: Story = {
  name: "Select Text On Focus",
  args: { selectTextOnFocus: true },
  parameters: {
    controls: { include: ["selectTextOnFocus"] },
  },
  render: (args) => html`
    <div style="display: grid; gap: 16px; max-width: 300px;">
      <ids-textbox-container>
        <ids-text-box
          defaultvalue="Boston"
          showicon="false"
          selecttextonfocus=${args.selectTextOnFocus ? "true" : "false"}
        ></ids-text-box>
      </ids-textbox-container>
      <ids-textbox-container>
        <ids-text-box
          componenttype="text-area"
          defaultvalue="Rack 4, shelf 2. Replace the fan module before the next firmware update."
          showicon="false"
          selecttextonfocus=${args.selectTextOnFocus ? "true" : "false"}
        ></ids-text-box>
      </ids-textbox-container>
    </div>
  `,
};

export const ControlledExample: Story = {
  name: "Controlled Example",
  render: () => {
    const [args, updateArgs] = useArgs();
    const value = (args as { value?: string }).value ?? "Editable value";
    return html`
      <ids-textbox-container>
        <ids-text-box
          .value=${value}
          @value-change=${(event: CustomEvent<string>) => {
            updateArgs({ value: event.detail });
          }}
        ></ids-text-box>
        <ids-control-helper>Current length: ${value.length}</ids-control-helper>
        <ids-control-error>Error message</ids-control-error>
      </ids-textbox-container>
    `;
  },
};

/** Standalone Angular-style props (no container). */
export const StandalonePropsApi: Story = {
  name: "Standalone Props API",
  parameters: {
    docs: {
      description: {
        story:
          "Legacy/standalone `helpertext` / `errortext` props on `ids-text-box` (Angular parity). Prefer composition above.",
      },
    },
  },
  render: () => html`
    <div style="display: grid; gap: 16px; width: 300px;">
      <ids-text-box
        label="Label:"
        placeholder="Placeholder Text"
        helpertext="Helper text"
      ></ids-text-box>
      <ids-text-box
        label="Label:"
        invalid
        errortext="Error message"
        value="Bad value"
      ></ids-text-box>
    </div>
  `,
};
