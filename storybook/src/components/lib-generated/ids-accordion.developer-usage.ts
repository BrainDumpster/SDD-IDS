/** Developer usage + Docs tab copy for IDS Accordion (React). */

export const ACCORDION_DOCS_DESCRIPTION = `
## Overview

Expandable panel group for sectioned content. Supports single- or multi-expand, left/right chevron, and a form variant. Prefer the **composition** tree (\`IdsAccordion\` → \`IdsAccordionItem\` → header/body/content). An optional \`items[]\` convenience API composes the same parts under the hood.

\`\`\`
IdsAccordion
  IdsAccordionItem
    IdsAccordionHeader          ← title + chevron (trigger surface)
    IdsAccordionBody            ← alias: IdsAccordionPanel
      IdsAccordionContent       ← inner content card (optional chrome)
\`\`\`

Import from \`@ids/react/accordion\` (or the compound \`IdsAccordionCompound\`).

## Props

### Root — \`IdsAccordion\`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`children\` | \`ReactNode\` | — | Composition API (preferred) |
| \`items\` | \`IdsAccordionItemInput[]\` | — | Convenience: builds Item/Header/Body/Content |
| \`multiple\` | \`boolean\` | \`false\` | Single-expand when false |
| \`defaultValue\` | \`string[]\` | \`[]\` | Uncontrolled initially open panel ids |
| \`value\` | \`string[]\` | — | Controlled open panel ids |
| \`chevronPosition\` | \`'left' \\| 'right'\` | \`'left'\` | Chevron slot on header |
| \`variant\` | \`'default' \\| 'form'\` | \`'default'\` | Form layout variant |
| \`className\` | \`string\` | — | Extra class on root |

### Item — \`IdsAccordionItem\`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`value\` | \`string\` | required | Unique panel id |
| \`disabled\` | \`boolean\` | \`false\` | Blocks toggle and focus activation |
| \`first\` | \`boolean\` | \`false\` | First item contiguous-border helper |
| \`children\` | \`ReactNode\` | — | Header + Body |

### Header — \`IdsAccordionHeader\`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`title\` | \`ReactNode\` | — | Preferred label API (chevron auto-placed) |
| \`children\` | \`ReactNode\` | — | Custom trigger content when \`title\` omitted |
| \`className\` | \`string\` | — | Extra class on \`h3\` shell |

### Content — \`IdsAccordionContent\`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`contentCard\` | \`boolean\` | \`true\` | Wrap children in design-spec content card |
| \`children\` | \`ReactNode\` | — | Panel body |

### Convenience item shape — \`IdsAccordionItemInput\`

| Field | Type | Notes |
|-------|------|-------|
| \`value\` | \`string\` | Required unique id |
| \`title\` | \`string\` | Header label |
| \`content\` | \`ReactNode\` | Expanded body |
| \`disabled\` | \`boolean\` | Optional |

## Events

| Callback | Signature | Notes |
|----------|-----------|-------|
| \`onValueChange\` | \`(openValues: string[]) => void\` | Fires after toggle with the open panel \`value\` ids (controlled and uncontrolled) |

## API

### Composition (preferred)

\`\`\`tsx
import {
  IdsAccordion,
  IdsAccordionItem,
  IdsAccordionHeader,
  IdsAccordionBody,
  IdsAccordionContent,
} from "@ids/react/accordion";

<IdsAccordion
  multiple={false}
  defaultValue={["network"]}
  chevronPosition="left"
  variant="default"
  onValueChange={(open) => console.log(open)}
>
  <IdsAccordionItem value="network" first>
    <IdsAccordionHeader title="Network configuration" />
    <IdsAccordionBody>
      <IdsAccordionContent>
        Configure network policies and service endpoints.
      </IdsAccordionContent>
    </IdsAccordionBody>
  </IdsAccordionItem>
</IdsAccordion>
\`\`\`

### Convenience \`items[]\`

\`\`\`tsx
<IdsAccordion
  items={[
    { value: "network", title: "Network configuration", content: "…" },
    { value: "security", title: "Security controls", content: "…" },
  ]}
  defaultValue={["network"]}
  onValueChange={setOpen}
/>
\`\`\`

### Keyboard & a11y

- Arrow Up/Down, Home, End — roving focus across enabled headers
- Space / Enter — toggle focused panel
- Header trigger: \`aria-expanded\`, \`aria-controls\`; body: \`role="region"\`, \`aria-labelledby\`
`.trim();

export const ACCORDION_SOURCE_CODE = `import {
  IdsAccordion,
  IdsAccordionBody,
  IdsAccordionContent,
  IdsAccordionHeader,
  IdsAccordionItem,
} from "@ids/react/accordion";

export function SettingsPanel() {
  return (
    <IdsAccordion
      multiple={false}
      defaultValue={["section1"]}
      chevronPosition="left"
      variant="default"
      onValueChange={(open) => console.log("open panels", open)}
    >
      <IdsAccordionItem value="section1" first>
        <IdsAccordionHeader title="Network configuration" />
        <IdsAccordionBody>
          <IdsAccordionContent>
            Configure network policies and service endpoints for this workspace.
          </IdsAccordionContent>
        </IdsAccordionBody>
      </IdsAccordionItem>

      <IdsAccordionItem value="section2">
        <IdsAccordionHeader title="Security controls" />
        <IdsAccordionBody>
          <IdsAccordionContent>
            Manage access rules, authentication options, and audit controls.
          </IdsAccordionContent>
        </IdsAccordionBody>
      </IdsAccordionItem>

      <IdsAccordionItem value="section3" disabled>
        <IdsAccordionHeader title="Integrations" />
        <IdsAccordionBody>
          <IdsAccordionContent>
            Connect external systems and event pipelines.
          </IdsAccordionContent>
        </IdsAccordionBody>
      </IdsAccordionItem>
    </IdsAccordion>
  );
}`;

export const ACCORDION_STORY_SOURCE_CODE = `<IdsAccordion
  multiple={false}
  defaultValue={["network"]}
  chevronPosition="left"
  variant="default"
  onValueChange={(open) => console.log(open)}
>
  <IdsAccordionItem value="network" first>
    <IdsAccordionHeader title="Network configuration" />
    <IdsAccordionBody>
      <IdsAccordionContent>
        Configure network policies and service endpoints for this workspace.
      </IdsAccordionContent>
    </IdsAccordionBody>
  </IdsAccordionItem>

  <IdsAccordionItem value="security">
    <IdsAccordionHeader title="Security controls" />
    <IdsAccordionBody>
      <IdsAccordionContent>
        Manage access rules, authentication options, and audit controls.
      </IdsAccordionContent>
    </IdsAccordionBody>
  </IdsAccordionItem>

  <IdsAccordionItem value="integrations" disabled>
    <IdsAccordionHeader title="Integrations" />
    <IdsAccordionBody>
      <IdsAccordionContent>
        Connect external systems and event pipelines.
      </IdsAccordionContent>
    </IdsAccordionBody>
  </IdsAccordionItem>
</IdsAccordion>`;
