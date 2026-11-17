/**
 * Storybook: IDS Lit Modal from `lib/lit/ids/modal`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/modal/design-spec.md
 * API: lib/react/ids/modal
 * Examples: storybook/src/components/lib-generated/Modal.stories.tsx
 * Figma: Modal-Main 11348:63064, ModalDialog-Main 11349:116221 (MCP 2026-11-13)
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/modal/register.js";
import "@ids/core/button/register.js";
import "@ids/core/text-box/register.js";
import type {
  IdsModalPage,
  IdsModalScenario,
  IdsModalSize,
  IdsModalType,
} from "@ids/core/modal";
import {
  MODAL_DOCS_DESCRIPTION,
  MODAL_SOURCE_CODE,
} from "./ids-modal.developer-usage";

type ModalStoryArgs = {
  open: boolean;
  scenario: IdsModalScenario;
  type: IdsModalType;
  size: IdsModalSize;
  title: string;
  description: string;
  closable: boolean;
  scrollBar: boolean;
  tabs: boolean;
  footerCheckbox: boolean;
  primaryActionLabel: string;
  tertiaryActionLabel?: string;
  secondaryActionLabel?: string;
  enablePrimaryAction: boolean;
  enableTertiaryAction: boolean;
  pages?: IdsModalPage[];
  onOpenChange?: (open: boolean) => void;
  onPrimaryAction?: () => void;
  onTertiaryAction?: () => void;
  onSecondaryAction?: () => void;
};

const meta: Meta<ModalStoryArgs> = {
  title: "Spec Generated/IDS/Modal",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: { component: MODAL_DOCS_DESCRIPTION },
      source: { code: MODAL_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    scenario: {
      control: "select",
      options: ["single-page", "multi-page", "dialog"],
    },
    type: {
      control: "select",
      options: [
        "non-alerting",
        "informational",
        "warning",
        "major",
        "critical",
        "destructive",
      ],
    },
    size: {
      control: "select",
      options: ["x-small", "small", "medium", "large"],
    },
    open: { control: "boolean" },
    closable: { control: "boolean" },
    scrollBar: { control: "boolean" },
    onOpenChange: { action: "onOpenChange" },
    onPrimaryAction: { action: "onPrimaryAction" },
    onTertiaryAction: { action: "onTertiaryAction" },
    onSecondaryAction: { action: "onSecondaryAction" },
  },
  args: {
    open: false,
    scenario: "dialog",
    type: "non-alerting",
    size: "large",
    title: "Non-Alerting",
    description:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
    closable: true,
    scrollBar: false,
    tabs: true,
    footerCheckbox: false,
    primaryActionLabel: "Close",
    enablePrimaryAction: true,
    enableTertiaryAction: true,
  },
};

export default meta;
type Story = StoryObj<ModalStoryArgs>;

function triggerButton(label: string, onClick: () => void) {
  return html`
    <ids-button
      variant="secondary"
      size="large"
      label=${label}
      @ids-button-click=${onClick}
    ></ids-button>
  `;
}

function propDrivenModal(
  args: ModalStoryArgs,
  options: { body?: unknown; triggerLabel: string } = {
    triggerLabel: "Open Modal",
  },
) {
  const [, setArgs] = useArgs();
  const setOpen = (next: boolean) => {
    setArgs({ open: next });
    args.onOpenChange?.(next);
  };

  return html`
    ${triggerButton(options.triggerLabel, () => setOpen(true))}
    <ids-modal
      .open=${args.open}
      scenario=${args.scenario}
      type=${args.type}
      size=${args.size}
      modaltitle=${args.title}
      description=${args.description}
      .closable=${args.closable}
      .scrollBar=${args.scrollBar}
      .tabs=${args.tabs}
      .footerCheckbox=${args.footerCheckbox}
      primaryactionlabel=${args.primaryActionLabel}
      tertiaryactionlabel=${args.tertiaryActionLabel ?? ""}
      secondaryactionlabel=${args.secondaryActionLabel ?? ""}
      .enablePrimaryAction=${args.enablePrimaryAction}
      .enableTertiaryAction=${args.enableTertiaryAction}
      .pages=${args.pages ?? []}
      .onOpenChange=${setOpen}
      .onPrimaryAction=${() => {
        args.onPrimaryAction?.();
        setOpen(false);
      }}
      .onTertiaryAction=${() => {
        args.onTertiaryAction?.();
        setOpen(false);
      }}
      .onSecondaryAction=${args.onSecondaryAction}
    >
      ${options.body ?? nothing}
    </ids-modal>
  `;
}

/** Main-layer anatomy composition (single-page) — matches design-spec mapping. */
export const MainLayerAnatomy: Story = {
  name: "Main Layer Anatomy",
  render: function Render() {
    const [args, setArgs] = useArgs<ModalStoryArgs>();
    const open = Boolean(args.open);
    const setOpen = (next: boolean) => setArgs({ open: next });
    return html`
      ${triggerButton("Open Main Layer Modal", () => setOpen(true))}
      <ids-modal
        .open=${open}
        scenario="single-page"
        size="medium"
        layer="main"
        .closable=${true}
        .onOpenChange=${setOpen}
      >
        <ids-modal-header>
          <ids-modal-title>Header</ids-modal-title>
          <ids-modal-close></ids-modal-close>
        </ids-modal-header>
        <ids-modal-description>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit.
        </ids-modal-description>
        <ids-modal-content>
          <div
            style="min-height:160px;border:1px solid var(--color-border-brand-base);background:var(--color-background-brand-lighter-slate);padding:16px;color:var(--color-text-gray-neutral);"
          >
            Content slot — custom body / page panel
          </div>
        </ids-modal-content>
        <ids-modal-footer>
          <div class="ids-modal-footer-start" style="margin-right:auto;">
            <label
              style="display:inline-flex;align-items:center;gap:8px;font-size:var(--font-size-body-2);color:var(--color-text-gray-neutral);"
            >
              <input type="checkbox" />
              Don’t show again until the next update
            </label>
          </div>
          <div style="display:inline-flex;gap:12px;">
            <ids-button
              variant="tertiary"
              size="large"
              label="Cancel"
              @ids-button-click=${() => setOpen(false)}
            ></ids-button>
            <ids-button
              variant="primary"
              size="large"
              label="Close"
              @ids-button-click=${() => setOpen(false)}
            ></ids-button>
          </div>
        </ids-modal-footer>
      </ids-modal>
    `;
  },
};

export const NonAlerting: Story = {
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "dialog",
        type: "non-alerting",
        title: "Non-Alerting",
        primaryActionLabel: "Close",
        tertiaryActionLabel: undefined,
        enableTertiaryAction: false,
      },
      { triggerLabel: "Open Dialog" },
    ),
};

export const Informational: Story = {
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "dialog",
        type: "informational",
        title: "Informational",
        primaryActionLabel: "Close",
        enableTertiaryAction: false,
      },
      { triggerLabel: "Open Informational Dialog" },
    ),
};

export const Warning: Story = {
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "dialog",
        type: "warning",
        title: "Warning",
        primaryActionLabel: "Continue",
        tertiaryActionLabel: "Cancel",
      },
      {
        triggerLabel: "Open Warning Dialog",
        body: html`<div
          style="color:var(--color-text-gray-neutral);line-height:20px;"
        >
          Continue to &lt;describe the action&gt;?
        </div>`,
      },
    ),
};

export const Major: Story = {
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "dialog",
        type: "major",
        title: "Major",
        primaryActionLabel: "Continue",
        tertiaryActionLabel: "Cancel",
      },
      {
        triggerLabel: "Open Major Dialog",
        body: html`<div
          style="color:var(--color-text-gray-neutral);line-height:20px;"
        >
          Continue to &lt;describe the action&gt;?
        </div>`,
      },
    ),
};

export const Critical: Story = {
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "dialog",
        type: "critical",
        title: "Critical",
        primaryActionLabel: "Continue",
        tertiaryActionLabel: "Cancel",
      },
      {
        triggerLabel: "Open Critical Dialog",
        body: html`<div
          style="color:var(--color-text-gray-neutral);line-height:20px;"
        >
          Continue to &lt;describe the action&gt;?
        </div>`,
      },
    ),
};

export const Destructive: Story = {
  render: function Render(args) {
    const [, setArgs] = useArgs();
    const open = Boolean(args.open);
    let confirmText = "";
    const setOpen = (next: boolean) => {
      setArgs({ open: next });
      args.onOpenChange?.(next);
    };

    // Local state via closure + re-render on input is awkward in CSF; use
    // a host element for confirm validity.
    return html`
      ${triggerButton("Open Destructive Dialog", () => setOpen(true))}
      <ids-modal
        .open=${open}
        scenario="dialog"
        type="destructive"
        modaltitle="Critical"
        description=${args.description}
        primaryactionlabel="Action"
        tertiaryactionlabel="Cancel"
        .enablePrimaryAction=${false}
        .enableTertiaryAction=${true}
        .closable=${true}
        .onOpenChange=${setOpen}
        .onTertiaryAction=${() => setOpen(false)}
        .onPrimaryAction=${() => setOpen(false)}
      >
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div style="color:var(--color-text-gray-neutral);">
            Type in CONFIRM below to verify the action.
          </div>
          <div style="width:300px;">
            <ids-text-box
              arialabel="Type CONFIRM"
              placeholder="CONFIRM"
              @value-change=${(e: CustomEvent<string>) => {
                confirmText = e.detail ?? "";
                const modal = (
                  e.target as HTMLElement
                ).closest("ids-modal") as HTMLElement & {
                  enablePrimaryAction: boolean;
                };
                if (modal) {
                  modal.enablePrimaryAction =
                    confirmText.trim().toUpperCase() === "CONFIRM";
                }
              }}
            ></ids-text-box>
          </div>
        </div>
      </ids-modal>
    `;
  },
};

export const SinglePageModalUsage: Story = {
  name: "Single-Page Modal Usage",
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "single-page",
        type: "non-alerting",
        size: "large",
        title: "Header",
        description:
          "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        primaryActionLabel: "Apply",
        tertiaryActionLabel: "Cancel",
      },
      {
        triggerLabel: "Open Single-Page Modal",
        body: html`<div
          style="min-height:220px;border:1px solid var(--color-border-brand-base);background:var(--color-background-brand-lighter-slate);padding:16px;color:var(--color-text-gray-neutral);"
        >
          <strong style="display:block;margin-bottom:8px;">Swap content</strong>
          Single-page usage keeps one continuous content panel without tab/page
          switching.
        </div>`,
      },
    ),
};

export const MultiPageModalUsage: Story = {
  name: "Multi-Page Modal Usage",
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "multi-page",
        type: "non-alerting",
        size: "large",
        title: "Header",
        description:
          "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
        primaryActionLabel: "Apply",
        tertiaryActionLabel: "Cancel",
        tabs: true,
        pages: [
          {
            id: "details",
            label: "Details",
            content: "Page 1 content: overview details and context.",
          },
          {
            id: "settings",
            label: "Settings",
            content: "Page 2 content: configurable settings and options.",
          },
          {
            id: "review",
            label: "Review",
            content: "Page 3 content: final review before apply.",
          },
        ],
      },
      { triggerLabel: "Open Multi-Page Modal" },
    ),
};

const LONG_TEXT =
  "Donec semper et, tristique sed purus. Mauris pretium volutpat consequat. Curabitur a risus vel risus tincidunt ultrices. Nulla facilisi. Praesent eu est diam. Etiam nec dolor arcu. Proin scelerisque orci sed arcu elementum porta. Pellentesque blandit nibh non quam luctus sagittis. Aenean blandit vel orci in iaculis. Vivamus accumsan risus a tortor ultrices tincidunt. Mauris id sapien accumsan eros placerat condimentum. Duis eu magna urna.";

function longContent(paragraphs = 14) {
  return html`<div
    style="display:flex;flex-direction:column;gap:16px;color:var(--color-text-gray-neutral);"
  >
    ${Array.from(
      { length: paragraphs },
      () => html`<p style="margin:0;">${LONG_TEXT}</p>`,
    )}
  </div>`;
}

export const SinglePageModalWithScrollBar: Story = {
  name: "Single-Page Modal With Scroll Bar",
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "single-page",
        type: "non-alerting",
        size: "small",
        title: "Header",
        description:
          "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        primaryActionLabel: "Apply",
        tertiaryActionLabel: "Cancel",
        scrollBar: true,
      },
      {
        triggerLabel: "Open Scrollable Single-Page Modal",
        body: longContent(),
      },
    ),
};

export const MultiPageModalWithScrollBar: Story = {
  name: "Multi-Page Modal With Scroll Bar",
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "multi-page",
        type: "non-alerting",
        size: "small",
        title: "Header",
        description:
          "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
        primaryActionLabel: "Apply",
        tertiaryActionLabel: "Cancel",
        scrollBar: true,
        tabs: true,
        pages: [
          { id: "details", label: "Details", content: LONG_TEXT.repeat(8) },
          { id: "settings", label: "Settings", content: LONG_TEXT.repeat(2) },
          {
            id: "review",
            label: "Review",
            content: "Page 3 content: final review before apply.",
          },
        ],
      },
      { triggerLabel: "Open Scrollable Multi-Page Modal" },
    ),
};

export const ThreeButtonGroup: Story = {
  name: "Three Button Group",
  render: (args) =>
    propDrivenModal(
      {
        ...args,
        scenario: "single-page",
        type: "non-alerting",
        size: "small",
        title: "Header",
        description:
          "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
        tertiaryActionLabel: "Cancel",
        secondaryActionLabel: "Secondary Action",
        primaryActionLabel: "Primary Action",
      },
      {
        triggerLabel: "Open Modal With Three Actions",
        body: html`Swap content area — page-specific content renders here.`,
      },
    ),
};
