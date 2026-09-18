/** Developer usage + Docs tab copy for IDS Accordion (React). */

export const SYNAPSE_ACCORDION_DOCS_DESCRIPTION = `
## Overview

Synapse Accordion is an IDS-fork façade over \`lib/react/ids/accordion\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/accordion\`.

Expandable panel group for sectioned content. Supports single- or multi-expand, left/right chevron, and a form variant. Prefer the **composition** tree (\`SynapseAccordion\` → \`SynapseAccordionItem\` → header/body/content). An optional \`items[]\` convenience API composes the same parts under the hood.

\`\`\`
SynapseAccordion
  SynapseAccordionItem
    SynapseAccordionHeader          ← title + chevron (trigger surface)
    SynapseAccordionBody            ← alias: SynapseAccordionPanel
      SynapseAccordionContent       ← inner content card (optional chrome)
\`\`\`

Import from \`@synapse/react/accordion\` (or the compound \`SynapseAccordionCompound\`).

## Props

### Root — \`SynapseAccordion\`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`children\` | \`ReactNode\` | — | Composition API (preferred) |
| \`items\` | \`SynapseAccordionItemInput[]\` | — | Convenience: builds Item/Header/Body/Content |
| \`multiple\` | \`boolean\` | \`false\` | Single-expand when false |
| \`defaultValue\` | \`string[]\` | \`[]\` | Uncontrolled initially open panel ids |
| \`value\` | \`string[]\` | — | Controlled open panel ids |
| \`chevronPosition\` | \`'left' \\| 'right'\` | \`'left'\` | Chevron slot on header |
| \`variant\` | \`'default' \\| 'form'\` | \`'default'\` | Form layout variant |
| \`className\` | \`string\` | — | Extra class on root |

### Item — \`SynapseAccordionItem\`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`value\` | \`string\` | required | Unique panel id |
| \`disabled\` | \`boolean\` | \`false\` | Blocks toggle and focus activation |
| \`first\` | \`boolean\` | \`false\` | First item contiguous-border helper |
| \`children\` | \`ReactNode\` | — | Header + Body |

### Header — \`SynapseAccordionHeader\`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`title\` | \`ReactNode\` | — | Preferred label API (chevron auto-placed) |
| \`children\` | \`ReactNode\` | — | Custom trigger content when \`title\` omitted |
| \`className\` | \`string\` | — | Extra class on \`h3\` shell |

### Content — \`SynapseAccordionContent\`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`contentCard\` | \`boolean\` | \`true\` | Wrap children in design-spec content card |
| \`children\` | \`ReactNode\` | — | Panel body |

### Convenience item shape — \`SynapseAccordionItemInput\`

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
  SynapseAccordion,
  SynapseAccordionItem,
  SynapseAccordionHeader,
  SynapseAccordionBody,
  SynapseAccordionContent,
} from "@synapse/react/accordion";

<SynapseAccordion
  multiple={false}
  defaultValue={["network"]}
  chevronPosition="left"
  variant="default"
  onValueChange={(open) => console.log(open)}
>
  <SynapseAccordionItem value="network" first>
    <SynapseAccordionHeader title="Network configuration" />
    <SynapseAccordionBody>
      <SynapseAccordionContent>
        Configure network policies and service endpoints.
      </SynapseAccordionContent>
    </SynapseAccordionBody>
  </SynapseAccordionItem>
</SynapseAccordion>
\`\`\`

### Convenience \`items[]\`

\`\`\`tsx
<SynapseAccordion
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

export const SYNAPSE_ACCORDION_SOURCE_CODE = `import {
  SynapseAccordion,
  SynapseAccordionBody,
  SynapseAccordionContent,
  SynapseAccordionHeader,
  SynapseAccordionItem,
} from "@synapse/react/accordion";

export function SettingsPanel() {
  return (
    <SynapseAccordion
      multiple={false}
      defaultValue={["section1"]}
      chevronPosition="left"
      variant="default"
      onValueChange={(open) => console.log("open panels", open)}
    >
      <SynapseAccordionItem value="section1" first>
        <SynapseAccordionHeader title="Network configuration" />
        <SynapseAccordionBody>
          <SynapseAccordionContent>
            Configure network policies and service endpoints for this workspace.
          </SynapseAccordionContent>
        </SynapseAccordionBody>
      </SynapseAccordionItem>

      <SynapseAccordionItem value="section2">
        <SynapseAccordionHeader title="Security controls" />
        <SynapseAccordionBody>
          <SynapseAccordionContent>
            Manage access rules, authentication options, and audit controls.
          </SynapseAccordionContent>
        </SynapseAccordionBody>
      </SynapseAccordionItem>

      <SynapseAccordionItem value="section3" disabled>
        <SynapseAccordionHeader title="Integrations" />
        <SynapseAccordionBody>
          <SynapseAccordionContent>
            Connect external systems and event pipelines.
          </SynapseAccordionContent>
        </SynapseAccordionBody>
      </SynapseAccordionItem>
    </SynapseAccordion>
  );
}`;

export const SYNAPSE_ACCORDION_STORY_SOURCE_CODE = `<SynapseAccordion
  multiple={false}
  defaultValue={["network"]}
  chevronPosition="left"
  variant="default"
  onValueChange={(open) => console.log(open)}
>
  <SynapseAccordionItem value="network" first>
    <SynapseAccordionHeader title="Network configuration" />
    <SynapseAccordionBody>
      <SynapseAccordionContent>
        Configure network policies and service endpoints for this workspace.
      </SynapseAccordionContent>
    </SynapseAccordionBody>
  </SynapseAccordionItem>

  <SynapseAccordionItem value="security">
    <SynapseAccordionHeader title="Security controls" />
    <SynapseAccordionBody>
      <SynapseAccordionContent>
        Manage access rules, authentication options, and audit controls.
      </SynapseAccordionContent>
    </SynapseAccordionBody>
  </SynapseAccordionItem>

  <SynapseAccordionItem value="integrations" disabled>
    <SynapseAccordionHeader title="Integrations" />
    <SynapseAccordionBody>
      <SynapseAccordionContent>
        Connect external systems and event pipelines.
      </SynapseAccordionContent>
    </SynapseAccordionBody>
  </SynapseAccordionItem>
</SynapseAccordion>`;
