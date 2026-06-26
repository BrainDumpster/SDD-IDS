/** Developer usage + Docs tab copy for IDS Accordion (Angular, composition API). */

export const ACCORDION_DOCS_DESCRIPTION = `
IDS Accordion — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/accordion/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/accordion.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-accordion
  ids-accordion-item
    ids-accordion-header          ← title projection + chevron (trigger surface)
    ids-accordion-body
      ids-accordion-content       ← inner content card
      ids-accordion-meta          ← optional
      ids-accordion-form-slot     ← optional (form variant)
\`\`\`

Import \`IDS_ACCORDION_IMPORTS\` from \`ids-accordion.imports.ts\` in any parent that renders this markup.

### Root API (\`ids-accordion\`)

| Input | Type | Default | Notes |
|-------|------|---------|-------|
| \`multiple\` | \`boolean\` | \`false\` | Single-expand when false |
| \`defaultValue\` | \`string[]\` | \`[]\` | Initially open panel \`value\` ids |
| \`chevronPosition\` | \`'left' \\| 'right'\` | \`'left'\` | Chevron slot on header |
| \`variant\` | \`'default' \\| 'form'\` | \`'default'\` | Enables \`ids-accordion-form-slot\` projection |

| Output | Type | Notes |
|--------|------|-------|
| \`valueChange\` | \`string[]\` | Emits open panel \`value\` ids after toggle |

### Item API (\`ids-accordion-item\`)

| Input | Type | Default |
|-------|------|---------|
| \`value\` | \`string\` | required — unique panel id |
| \`disabled\` | \`boolean\` | \`false\` |

### Theme & assets

- Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
- Chevron icon: \`assets/icons/chev-down-thick.svg\` (mask tint via component styles).

### Keyboard

Arrow Up/Down, Home, End roving focus; Space/Enter toggles the focused panel.
`.trim();

export const ACCORDION_SOURCE_CODE = `import { Component } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { IDS_ACCORDION_IMPORTS } from "./ids-accordion/ids-accordion.imports";
import { ACCORDION_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/accordion.contract";

@Component({
  standalone: true,
  imports: [...IDS_ACCORDION_IMPORTS],
  template: \`
    <ids-accordion
      [multiple]="multiple"
      [defaultValue]="defaultOpen"
      chevronPosition="left"
      variant="default"
      (valueChange)="onOpenChange($event)"
    >
      <ids-accordion-item value="section1">
        <ids-accordion-header>Network configuration</ids-accordion-header>
        <ids-accordion-body>
          <ids-accordion-content>
            Configure network policies and service endpoints for this workspace.
          </ids-accordion-content>
        </ids-accordion-body>
      </ids-accordion-item>

      <ids-accordion-item value="section2">
        <ids-accordion-header>Security controls</ids-accordion-header>
        <ids-accordion-body>
          <ids-accordion-content>
            Manage access rules, authentication options, and audit controls.
          </ids-accordion-content>
        </ids-accordion-body>
      </ids-accordion-item>

      <ids-accordion-item value="section3" [disabled]="true">
        <ids-accordion-header>Integrations</ids-accordion-header>
        <ids-accordion-body>
          <ids-accordion-content>
            Connect external systems and event pipelines.
          </ids-accordion-content>
        </ids-accordion-body>
      </ids-accordion-item>
    </ids-accordion>
  \`,
})
export class SettingsPanelComponent {
  readonly multiple = ACCORDION_SPEC_ACCURATE_DEFAULTS.multiple;
  readonly defaultOpen = [...ACCORDION_SPEC_ACCURATE_DEFAULTS.defaultValue];

  onOpenChange(open: string[]): void {
    console.log("open panels", open);
  }
}

bootstrapApplication(SettingsPanelComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const ACCORDION_STORY_SOURCE_CODE = `<ids-accordion
  [multiple]="false"
  [defaultValue]="['section1']"
  chevronPosition="left"
  variant="default"
  (valueChange)="onOpenChange($event)"
>
  <ids-accordion-item value="section1">
    <ids-accordion-header>Network configuration</ids-accordion-header>
    <ids-accordion-body>
      <ids-accordion-content>
        Configure network policies and service endpoints for this workspace.
      </ids-accordion-content>
    </ids-accordion-body>
  </ids-accordion-item>

  <ids-accordion-item value="section2">
    <ids-accordion-header>Security controls</ids-accordion-header>
    <ids-accordion-body>
      <ids-accordion-content>
        Manage access rules, authentication options, and audit controls.
      </ids-accordion-content>
    </ids-accordion-body>
  </ids-accordion-item>

  <ids-accordion-item value="section3" [disabled]="true">
    <ids-accordion-header>Integrations</ids-accordion-header>
    <ids-accordion-body>
      <ids-accordion-content>
        Connect external systems and event pipelines.
      </ids-accordion-content>
    </ids-accordion-body>
  </ids-accordion-item>
</ids-accordion>`;

/** Inline template for Spec Accurate Design story canvas. */
export const ACCORDION_COMPOSITION_DEMO_TEMPLATE = `
<ids-accordion
  [multiple]="multiple"
  [defaultValue]="defaultValue"
  [chevronPosition]="chevronPosition"
  [variant]="variant"
  (valueChange)="valueChange($event)"
>
  <ids-accordion-item value="section1">
    <ids-accordion-header>Network configuration</ids-accordion-header>
    <ids-accordion-body>
      <ids-accordion-content>
        Configure network policies and service endpoints for this workspace. Learn how network policies work in the admin guide.
      </ids-accordion-content>
    </ids-accordion-body>
  </ids-accordion-item>

  <ids-accordion-item value="section2">
    <ids-accordion-header>Security controls</ids-accordion-header>
    <ids-accordion-body>
      <ids-accordion-content>
        Manage access rules, authentication options, and audit controls for your environment.
      </ids-accordion-content>
    </ids-accordion-body>
  </ids-accordion-item>

  <ids-accordion-item value="section3" [disabled]="true">
    <ids-accordion-header>Integrations</ids-accordion-header>
    <ids-accordion-body>
      <ids-accordion-content>
        Connect external systems and event pipelines. This section is disabled in the demo matrix.
      </ids-accordion-content>
    </ids-accordion-body>
  </ids-accordion-item>
</ids-accordion>
`.trim();
