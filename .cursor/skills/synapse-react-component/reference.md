# Synapse React templates

Replace `<slug>`, `<idsSlug>`, `{Root}` (PascalCase without prefix), and `{Name}` (sidebar label).

## Façade

`lib/react/synapse/<slug>/index.ts`

```ts
/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/<idsSlug>`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  Ids{Root} as Synapse{Root},
  Ids{Root}LeadingIcon as Synapse{Root}LeadingIcon,
  Ids{Root}Label as Synapse{Root}Label,
  type Ids{Root}Props as Synapse{Root}Props,
} from "../../ids/<idsSlug>";
```

Re-export **every** public `Ids*` value and type from `lib/react/ids/<idsSlug>/index.ts` with the `Synapse` prefix.

## Contract

`component-contracts/synapse/<slug>.contract.ts`

```ts
export const SYNAPSE_{SLUG_SNAKE}_DESIGN_SPEC_PATH =
  "components/synapse/<slug>/design-spec.md" as const;

export const SYNAPSE_{SLUG_SNAKE}_IDS_BASELINE_SPEC_PATH =
  "components/ids/<idsSlug>/design-spec.md" as const;

export const SYNAPSE_{SLUG_SNAKE}_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_{SLUG_SNAKE}_SPEC_ACCURATE_VARIANT_NODE_ID = "<node-id>" as const;
```

Take node ids from the Synapse design-spec **Metadata** / **Source Mapping**. Add other node constants the IDS contract has if the story cites them.

`storybook/src/spec-contracts/synapse-<slug>.contract.ts`:

```ts
export * from "@component-contracts/synapse/<slug>.contract";
```

## Storybook

`storybook/src/components/lib-generated/Synapse{Root}.stories.tsx`

```tsx
/**
 * Storybook: Synapse {Name} from `lib/react/synapse/<slug>`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/<slug>/design-spec.md
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import { SPEC_ACCURATE_DESIGN_STORY } from "@component-contracts/common/story-meta";
import {
  SYNAPSE_{SLUG_SNAKE}_DESIGN_SPEC_PATH,
  SYNAPSE_{SLUG_SNAKE}_SPEC_ACCURATE_VARIANT_NODE_ID,
} from "../../spec-contracts/synapse-<slug>.contract";
import {
  SYNAPSE_{SLUG_SNAKE}_DOCS_DESCRIPTION,
  SYNAPSE_{SLUG_SNAKE}_SOURCE_CODE,
} from "./synapse-<slug>.developer-usage";
import {
  Synapse{Root},
  type Synapse{Root}Props,
} from "@synapse/react/<slug>";

const meta: Meta<Synapse{Root}Props> = {
  tags: ["autodocs"],
  title: "Components/Synapse/{Name}",
  component: Synapse{Root},
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: [
          SYNAPSE_{SLUG_SNAKE}_DOCS_DESCRIPTION,
          `Source: \`${SYNAPSE_{SLUG_SNAKE}_DESIGN_SPEC_PATH}\`. Spec Accurate Design → Figma \`${SYNAPSE_{SLUG_SNAKE}_SPEC_ACCURATE_VARIANT_NODE_ID}\`.`,
          "Theme: `components/synapse-theme.css`. Import from `@synapse/react/<slug>`.",
        ].join("\n\n"),
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_{SLUG_SNAKE}_SOURCE_CODE,
      },
    },
  },
};

export default meta;
type Story = StoryObj<Synapse{Root}Props>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
  render: (args) => <Synapse{Root} {...args} />,
};
```

Add the same extra stories as the IDS lib-generated file (Variants, Sizes, states), remapped to `Synapse*` names and spec defaults.

`synapse-<slug>.developer-usage.ts` must state:

- IDS-fork façade / `reexport`
- Load `components/synapse-theme.css` only
- Anatomy tree using `Synapse*` identifiers
- Import from `@synapse/react/<slug>`
- A copy-paste usage example (that string is also `SYNAPSE_{SLUG_SNAKE}_SOURCE_CODE`)

See `storybook/src/components/lib-generated/synapse-<slug>.developer-usage.ts` once created; until then follow this section.

## Standalone

No IDS alias. Spec **Metadata** must include `Spec pattern: standalone`.

`lib/react/synapse/<slug>/index.ts`

```ts
/**
 * Synapse — strategy: standalone.
 * Source: `components/synapse/<slug>/design-spec.md`
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  Synapse{Root},
  type Synapse{Root}Props,
} from "./Synapse{Root}";
```

Implement `Synapse{Root}.tsx` + `Synapse{Root}.module.css` from **Anatomy**, **Tokens**, and **Composition & API**. Tokens are `var(--…)` from the spec; no `Ids*` imports.

Standalone contract omits `SYNAPSE_{SLUG_SNAKE}_IDS_BASELINE_SPEC_PATH`.

Developer-usage copy: Synapse-native / `standalone` (not an IDS-fork façade).

## Wrapper / overlay (exception)

Only when `react-strategy.json` is `wrapper` or `overlay-css`:

- Keep slot reexports as `IdsX as SynapseX`.
- Put the thin wrapper in `Synapse{Root}.tsx` + optional `Synapse{Root}.module.css`.
- Stories still live under `lib-generated/` and import `@synapse/react/<slug>`.
