# IDS Accordion (Angular)

Isolated Angular implementation in `storybook-angular/` (port **6007**). React Storybook runs separately on port **6006**.

Uses the **composition API** from `components/ids/accordion/design-spec.md` — children inside `ids-accordion`, not an `items[]` prop.

## Storybook

```bash
cd storybook-angular && npm run dev:clean
```

Use the **Docs** tab (sidebar under Accordion) for API tables and the **Code** panel:

http://localhost:6007/?path=/docs/spec-generated-ids-accordion--docs

Canvas story (controls + live preview):

http://localhost:6007/?path=/story/spec-generated-ids-accordion--spec-accurate-design

> Use port **6007** for Angular. Port 6006 is React only.

## App usage

```typescript
import { Component } from "@angular/core";
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { IDS_ACCORDION_IMPORTS } from "./ids-accordion/ids-accordion.imports";
import { ACCORDION_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/accordion.contract";

@Component({
  standalone: true,
  imports: [...IDS_ACCORDION_IMPORTS],
  template: `
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
            Configure network policies and service endpoints.
          </ids-accordion-content>
        </ids-accordion-body>
      </ids-accordion-item>
    </ids-accordion>
  `,
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
});
```

Load `components/ids-theme.css` on the app root (`data-design-system="ids"`).

## Anatomy

```
ids-accordion
  ids-accordion-item [value] [disabled]
    ids-accordion-header          ← project title; chevron + trigger live here
    ids-accordion-body
      ids-accordion-content       ← inner content card
      ids-accordion-meta          ← optional
      ids-accordion-form-slot     ← optional (form variant)
```

## Root API (`ids-accordion`)

| Input | Type | Default |
|-------|------|---------|
| `multiple` | `boolean` | `false` |
| `defaultValue` | `string[]` | `[]` |
| `chevronPosition` | `'left' \| 'right'` | `'left'` |
| `variant` | `'default' \| 'form'` | `'default'` |

| Output | Type |
|--------|------|
| `valueChange` | `string[]` — open panel value ids |

## Item API (`ids-accordion-item`)

| Input | Type | Default |
|-------|------|---------|
| `value` | `string` | required |
| `disabled` | `boolean` | `false` |

## Files

| File | Purpose |
|------|---------|
| `ids-accordion.component.ts` | Root — open state, keyboard roving |
| `ids-accordion-item.component.ts` | Item shell |
| `ids-accordion-header.component.ts` | Trigger + title projection |
| `ids-accordion-body.component.ts` | Panel wrapper |
| `ids-accordion-content.component.ts` | Content card slot |
| `ids-accordion-meta.component.ts` | Optional meta slot |
| `ids-accordion-form-slot.component.ts` | Optional form slot |
| `ids-accordion.imports.ts` | `IDS_ACCORDION_IMPORTS` barrel |
| `ids-accordion.stories.js` | Storybook CSF (`SpecAccurateDesign`) |
| `ids-accordion.developer-usage.js` | Docs tab + Code panel snippets |

Contract defaults: `component-contracts/ids/accordion.contract.ts`.
