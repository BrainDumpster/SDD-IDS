/** Developer usage + Docs tab copy for IDS Toast (Angular). */

export const TOAST_DOCS_DESCRIPTION = `
IDS Toast — Angular 21 standalone **composition** API (\`storybook-angular\`, port **6007**).

**Spec:** \`components/ids/toast/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/toast.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
ids-toast-viewport [position?, maxVisible?, items? | projected ids-toast-item]
  ids-toast-item [id?, type?, message, duration?, closable?, link?, role?, className?]
    ids-toast-icon-container
    ids-toast-message
    ids-toast-view-details-action
    ids-toast-close-action
\`\`\`

Matches React \`lib/react/ids/toast\` (internal slots there; Angular projects the same anatomy). Viewport also accepts React-style \`items[]\` FIFO.

Import \`IDS_TOAST_IMPORTS\` from \`lib/angular/ids/toast\`.

### Item API (\`ids-toast-item\`)

| Input | Default | Notes |
|-------|---------|-------|
| \`id\` | — | Included in close/timeout payloads |
| \`type\` | \`info\` | \`info \\| critical \\| major-warning \\| minor-warning \\| success\`; unknown → \`info\` |
| \`message\` | required | Used when \`ids-toast-message\` has no projected text |
| \`duration\` | \`8000\` | Host timeout ms. \`0\` disables auto-dismiss. Invalid → \`8000\` |
| \`closable\` | \`true\` | When false, close action is not rendered |
| \`link\` | — | View Details contract (\`label\`, \`href?\`, \`routerLink?\`, \`target?\`, \`onClick?\`) |
| \`role\` | \`status\` | Allow \`alert\` when product rules require |
| \`className\` | — | Extra class on the item host |

| Output | Notes |
|--------|-------|
| \`onClose\` | \`{ id?, reason: close-click \\| timeout \\| programmatic }\` |
| \`onTimeout\` | \`{ id? }\` when the timer dismisses the item |

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
`.trim();

export const TOAST_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_TOAST_IMPORTS } from "./toast";
import { TOAST_SPEC_ACCURATE_DEFAULTS } from "@component-contracts/ids/toast.contract";

@Component({
  standalone: true,
  imports: [...IDS_TOAST_IMPORTS],
  template: \`
    <ids-toast-viewport [position]="position">
      <ids-toast-item
        [type]="type"
        [message]="message"
        [duration]="duration"
        [closable]="closable"
        [link]="link"
        (onClose)="onClose($event)"
        (onTimeout)="onTimeout($event)"
      >
        <ids-toast-icon-container />
        <ids-toast-message />
        <ids-toast-view-details-action />
        <ids-toast-close-action />
      </ids-toast-item>
    </ids-toast-viewport>
  \`,
})
export class AppComponent {
  type = TOAST_SPEC_ACCURATE_DEFAULTS.type;
  message = TOAST_SPEC_ACCURATE_DEFAULTS.message;
  duration = TOAST_SPEC_ACCURATE_DEFAULTS.duration;
  closable = TOAST_SPEC_ACCURATE_DEFAULTS.closable;
  position = TOAST_SPEC_ACCURATE_DEFAULTS.position;
  link = TOAST_SPEC_ACCURATE_DEFAULTS.link;
  onClose(detail) {}
  onTimeout(detail) {}
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const TOAST_STORY_SOURCE_CODE = `<ids-toast-viewport position="top-right">
  <ids-toast-item
    type="info"
    message="This is a temporary and brief notification following a user action."
    [duration]="0"
    [link]="{ label: 'View Details' }"
  >
    <ids-toast-icon-container />
    <ids-toast-message />
    <ids-toast-view-details-action />
    <ids-toast-close-action />
  </ids-toast-item>
</ids-toast-viewport>`;

export const TOAST_COMPOSITION_DEMO_TEMPLATE = `
<ids-toast-viewport [position]="position">
  <ids-toast-item
    [id]="id"
    [type]="type"
    [message]="message"
    [duration]="duration"
    [closable]="closable"
    [link]="link"
    [role]="role"
    [className]="className"
    (onClose)="onClose($event)"
    (onTimeout)="onTimeout($event)"
  >
    <ids-toast-icon-container />
    <ids-toast-message />
    <ids-toast-view-details-action />
    <ids-toast-close-action />
  </ids-toast-item>
</ids-toast-viewport>`;
