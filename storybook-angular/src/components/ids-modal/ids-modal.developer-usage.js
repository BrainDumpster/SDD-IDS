/** Developer usage + Docs tab copy for IDS Modal (Angular). */

export const MODAL_DOCS_DESCRIPTION = `
IDS Modal — Angular 21 standalone API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/modal/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/modal.contract.ts\`

### Anatomy (composition — preferred)

\`\`\`
ids-modal [scenario, type, size, closable, …]
  ids-modal-title
  ids-modal-body [description?]
  ids-modal-footer
    ids-button × n
\`\`\`

Import \`IDS_MODAL_IMPORTS\` from \`ids-modal.imports.ts\`.

String props (\`title\`, \`description\`, \`primaryActionLabel\`) remain shorthand when slots are not projected.

### API (\`ids-modal\` root)

Root handles shell chrome (scenario, type, size, closable, scrollBar, tabs, pages, footerCheckbox). Project **title**, **body**, and **footer** via composition slots (preferred).

| Input | Type | Default | Notes |
|-------|------|---------|-------|
| \`open\` | \`boolean\` | — | Controlled visibility |
| \`defaultOpen\` | \`boolean\` | \`false\` | Uncontrolled initial state |
| \`scenario\` | \`single-page \\| multi-page \\| dialog\` | \`dialog\` | Usage model |
| \`type\` | dialog severity | \`non-alerting\` | Dialog scenario only |
| \`size\` | \`x-small \\| small \\| medium \\| large\` | \`medium\` | Figma size matrix |
| \`closable\` | \`boolean\` | \`true\` | Close icon + escape |
| \`scrollBar\` | \`boolean\` | \`false\` | Scrollable content + gradient cue |
| \`tabs\` | \`boolean\` | \`false\` | Multi-page tab strip |
| \`pages\` | \`ModalPage[]\` | \`[]\` | Multi-page content |
| \`footerCheckbox\` | \`boolean\` | \`false\` | Optional footer checkbox |
| \`title\` | \`string\` | — | Shorthand when \`ids-modal-title\` absent |
| \`description\` | \`string\` | — | Shorthand when \`ids-modal-body\` absent |
| \`primaryActionLabel\` | \`string\` | — | Shorthand when \`ids-modal-footer\` absent |
| \`tertiaryActionLabel\` | \`string\` | — | Shorthand tertiary when footer slot absent |

| Output | Notes |
|--------|-------|
| \`openChange\` | Visibility changed |
| \`closed\` | Modal closed |
| \`primaryAction\` | Primary footer action |
| \`tertiaryAction\` | Tertiary footer action |
| \`pageChange\` | Multi-page tab selected |

### Theme & assets

- Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
- Close icon: \`assets/icons/shape-x.svg\`
- Severity icons: \`status-critical-square-solid\`, \`status-warn-tri-solid\`, \`status-error-diamond-solid\`, \`info-circ-solid\`
- Footer buttons use \`ids-button\` (IDS Button contract).

### Keyboard

Escape closes when \`closable=true\`. Native \`<dialog>\` provides focus trap when open.
`.trim();

export const MODAL_SOURCE_CODE = `import { Component } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { IDS_MODAL_IMPORTS } from "./ids-modal/ids-modal.imports";
import { MODAL_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/modal.contract";

@Component({
  standalone: true,
  imports: [...IDS_MODAL_IMPORTS],
  template: \`
    <ids-button variant="primary" size="lg" (clicked)="modal.openModal()">
      Open Dialog
    </ids-button>

    <ids-modal
      #modal
      [scenario]="scenario"
      [type]="type"
      [size]="size"
      [closable]="closable"
      (closed)="onClose()"
    >
      <ids-modal-title>{{ title }}</ids-modal-title>
      <ids-modal-body [description]="description" />
      <ids-modal-footer>
        <ids-button variant="primary" size="lg" (clicked)="onPrimary()">
          {{ primaryActionLabel }}
        </ids-button>
      </ids-modal-footer>
    </ids-modal>
  \`,
})
export class AppComponent {
  scenario = MODAL_SPEC_ACCURATE_DEFAULTS.scenario;
  type = MODAL_SPEC_ACCURATE_DEFAULTS.type;
  size = MODAL_SPEC_ACCURATE_DEFAULTS.size;
  title = MODAL_SPEC_ACCURATE_DEFAULTS.title;
  description = MODAL_SPEC_ACCURATE_DEFAULTS.description;
  closable = MODAL_SPEC_ACCURATE_DEFAULTS.closable;
  primaryActionLabel = MODAL_SPEC_ACCURATE_DEFAULTS.primaryActionLabel;

  onClose(): void {}
  onPrimary(): void {}
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});
`.trim();

export const MODAL_STORY_SOURCE_CODE = `<ids-button variant="primary" size="lg" (clicked)="modal.openModal()">
  Open Non-Alerting Dialog
</ids-button>

<ids-modal
  #modal
  scenario="dialog"
  type="non-alerting"
  size="large"
  [closable]="true"
  (closed)="onClose()"
>
  <ids-modal-title>Non-Alerting</ids-modal-title>
  <ids-modal-body [description]="description" />
  <ids-modal-footer>
    <ids-button variant="primary" size="lg" (clicked)="onPrimary()">Close</ids-button>
  </ids-modal-footer>
</ids-modal>`;

export const MODAL_COMPOSITION_DEMO_TEMPLATE = `
<div style="display: grid; gap: 12px;">
  <ids-button variant="primary" size="lg" (clicked)="modal.openModal()">
    Open Non-Alerting Dialog
  </ids-button>

  <ids-modal
    #modal
    [scenario]="scenario"
    [type]="type"
    [size]="size"
    [closable]="closable"
    (closed)="onClose()"
    (primaryAction)="onPrimary()"
  >
    <ids-modal-title>{{ title }}</ids-modal-title>
    <ids-modal-body [description]="description" />
    <ids-modal-footer>
      <ids-button variant="primary" size="lg" (clicked)="onPrimary()">
        {{ primaryActionLabel }}
      </ids-button>
    </ids-modal-footer>
  </ids-modal>
</div>
`;

export const MODAL_DIALOG_TYPE_MATRIX_TEMPLATE = `
<div style="display: grid; gap: 16px; max-width: 640px;">
  @for (item of dialogTypes; track item.type) {
    <div>
      <ids-button variant="secondary" size="lg" (clicked)="dialog.openModal()">
        Open {{ item.label }} Dialog
      </ids-button>
      <ids-modal
        #dialog
        scenario="dialog"
        [type]="item.type"
        size="large"
        (primaryAction)="log('primary', item.type)"
        (tertiaryAction)="log('tertiary', item.type)"
        (closed)="log('close', item.type)"
      >
        <ids-modal-title>{{ item.title }}</ids-modal-title>
        <ids-modal-body [description]="description" />
        <ids-modal-footer>
          @if (item.showTertiary) {
            <ids-button variant="tertiary" size="lg" (clicked)="log('tertiary', item.type)">
              Cancel
            </ids-button>
          }
          <ids-button variant="primary" size="lg" (clicked)="log('primary', item.type)">
            {{ item.primaryLabel }}
          </ids-button>
        </ids-modal-footer>
      </ids-modal>
    </div>
  }
</div>
`;

export const MODAL_SINGLE_PAGE_TEMPLATE = `
<div style="display: grid; gap: 12px;">
  <ids-button variant="secondary" size="lg" (clicked)="modal.openModal()">
    Open Single-Page Modal
  </ids-button>
  <ids-modal
    #modal
    scenario="single-page"
    type="non-alerting"
    size="large"
    (primaryAction)="log('primary')"
    (tertiaryAction)="log('tertiary')"
    (closed)="log('close')"
  >
    <ids-modal-title>Header</ids-modal-title>
    <ids-modal-body description="Single-page modal usage.">
      <div
        style="
          min-height: 220px;
          border: 1px solid var(--color-border-brand-base);
          background: var(--color-background-brand-lighter-slate);
          padding: 16px;
          color: var(--color-text-gray-neutral);
        "
      >
        <strong style="display: block; margin-bottom: 8px;">Swap content</strong>
        Single-page usage keeps one continuous content panel without tab/page switching.
      </div>
    </ids-modal-body>
    <ids-modal-footer>
      <ids-button variant="tertiary" size="lg" (clicked)="log('tertiary')">
        Cancel
      </ids-button>
      <ids-button variant="primary" size="lg" (clicked)="log('primary')">
        Apply
      </ids-button>
    </ids-modal-footer>
  </ids-modal>
</div>
`;

export const MODAL_MULTI_PAGE_TEMPLATE = `
<div style="display: grid; gap: 12px;">
  <ids-button variant="secondary" size="lg" (clicked)="modal.openModal()">
    Open Multi-Page Modal
  </ids-button>
  <ids-modal
    #modal
    scenario="multi-page"
    type="non-alerting"
    size="large"
    [tabs]="true"
    [pages]="pages"
    (pageChange)="log('page', $event)"
    (primaryAction)="log('primary')"
    (tertiaryAction)="log('tertiary')"
    (closed)="log('close')"
  >
    <ids-modal-title>Header</ids-modal-title>
    <ids-modal-body description="Multi page modal usage with tabs/pages." />
    <ids-modal-footer>
      <ids-button variant="tertiary" size="lg" (clicked)="log('tertiary')">
        Cancel
      </ids-button>
      <ids-button variant="primary" size="lg" (clicked)="log('primary')">
        Apply
      </ids-button>
    </ids-modal-footer>
  </ids-modal>
</div>
`;

export const MODAL_DESTRUCTIVE_TEMPLATE = `
<div style="display: grid; gap: 12px;">
  <ids-button variant="secondary" size="lg" (clicked)="modal.openModal()">
    Open Destructive Dialog
  </ids-button>
  <ids-modal
    #modal
    scenario="dialog"
    type="destructive"
    size="large"
    [enablePrimaryAction]="confirmValid"
    (primaryAction)="log('primary')"
    (tertiaryAction)="log('tertiary')"
    (closed)="log('close')"
  >
    <ids-modal-title>Critical</ids-modal-title>
    <ids-modal-body [description]="description">
      <div style="display: grid; gap: 12px;">
        <p style="margin: 0; color: var(--color-text-gray-neutral);">
          Type in CONFIRM below to verify the action.
        </p>
        <ids-text-box
          ariaLabel="Type CONFIRM"
          placeholder="CONFIRM"
          [value]="confirmText"
          (valueChange)="onConfirmChange($event)"
        />
      </div>
    </ids-modal-body>
    <ids-modal-footer>
      <ids-button variant="tertiary" size="lg" (clicked)="log('tertiary')">
        Cancel
      </ids-button>
      <ids-button
        variant="primary"
        size="lg"
        [disabled]="!confirmValid"
        (clicked)="log('primary')"
      >
        Action
      </ids-button>
    </ids-modal-footer>
  </ids-modal>
</div>
`;
