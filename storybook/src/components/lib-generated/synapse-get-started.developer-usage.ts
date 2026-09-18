/** Developer usage + Docs tab copy for IDS GetStarted (React). */

export const SYNAPSE_GET_STARTED_DOCS_DESCRIPTION = `
## Overview

Synapse Get Started is an IDS-fork façade over \`lib/react/ids/get-started\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/get-started\`.

Onboarding hero with module cards, configure actions, and optional masthead.

\`\`\`
SynapseGetStarted
  SynapseGetStartedHeroHeader
  SynapseGetStartedHeroBackground
  SynapseGetStartedHeroShadowBand
  SynapseGetStartedHeroHoneycomb
  SynapseGetStartedMastheadSlot
  SynapseGetStartedHeroTitle
  SynapseGetStartedHeroSubtitle
  SynapseGetStartedContainer
  SynapseGetStartedCardTrack
  SynapseGetStartedCardAnchor
  SynapseGetStartedCard
  SynapseGetStartedCardIconBadge
  SynapseGetStartedCardTitleBand
\`\`\`

Import from \`@synapse/react/get-started\`.

## Props

### \`SynapseGetStartedCardInput\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string \\| number\` | required |
| \`title\` | \`string\` | required |
| \`description\` | \`string\` | — |
| \`text\` | \`string\` | — |
| \`note\` | \`string\` | — |
| \`icon\` | \`string\` | — |
| \`iconShapeName\` | \`string\` | — |
| \`cardState\` | \`SynapseGetStartedCardState\` | — |
| \`isDisabled\` | \`boolean\` | — |
| \`isRequired\` | \`boolean\` | — |
| \`isConfigured\` | \`boolean\` | — |
| \`actionButtonText\` | \`string\` | — |
| \`actionButtonTextIfConfigured\` | \`string\` | — |
| \`configureButtonTooltip\` | \`string\` | — |
| \`btnTooltip\` | \`string\` | — |

### \`SynapseGetStartedMastheadProps\`

| Prop | Type | Default |
|------|------|---------|
| \`productName\` | \`ReactNode\` | — |
| \`logo\` | \`ReactNode\` | — |
| \`iconsSlot\` | \`ReactNode\` | — |
| \`avatarSlot\` | \`ReactNode\` | — |

### \`SynapseGetStartedProps\`

| Prop | Type | Default |
|------|------|---------|
| \`title\` | \`string\` | — |
| \`bannerTitle\` | \`string\` | — |
| \`subtitle\` | \`string\` | — |
| \`bannerDescription\` | \`string\` | — |
| \`cards\` | \`SynapseGetStartedCardInput[]\` | — |
| \`overflow\` | \`boolean\` | — |
| \`sequential\` | \`boolean\` | — |
| \`overflowPage\` | \`SynapseGetStartedOverflowPage\` | — |
| \`showMasthead\` | \`boolean\` | — |
| \`isHeaderRequired\` | \`boolean\` | — |
| \`headerActionsDisabled\` | \`boolean\` | — |
| \`productName\` | \`string\` | — |
| \`mastheadProps\` | \`SynapseGetStartedMastheadProps\` | — |
| \`mastheadSlot\` | \`ReactNode\` | — |
| \`skipButtonText\` | \`string\` | — |
| \`launchButtonText\` | \`string\` | — |
| \`skipButtonTooltip\` | \`string\` | — |
| \`launchButtonTooltip\` | \`string\` | — |

### \`SynapseGetStartedHeroBackgroundProps\`

| Prop | Type | Default |
|------|------|---------|
| \`className\` | \`string\` | — |

### \`SynapseGetStartedHeroShadowBandProps\`

| Prop | Type | Default |
|------|------|---------|
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onConfigure\` | \`SynapseGetStartedProps\` | \`(card: SynapseGetStartedCardInput) => void\` |
| \`onSkip\` | \`SynapseGetStartedProps\` | \`() => void\` |
| \`onOverflowNavigate\` | \`SynapseGetStartedProps\` | \`(direction: "prev" \\| "next") => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseGetStarted,
  SynapseGetStartedHeroHeader,
  SynapseGetStartedHeroBackground,
  SynapseGetStartedHeroShadowBand,
  SynapseGetStartedHeroHoneycomb,
  SynapseGetStartedMastheadSlot,
} from "@synapse/react/get-started";
\`\`\`

### Usage

\`\`\`tsx
<SynapseGetStarted>
  {/* project children / slots per anatomy */}
</SynapseGetStarted>
\`\`\`
`.trim();

export const SYNAPSE_GET_STARTED_SOURCE_CODE = `import {
  SynapseGetStarted,
  SynapseGetStartedHeroHeader,
  SynapseGetStartedHeroBackground,
  SynapseGetStartedHeroShadowBand,
  SynapseGetStartedHeroHoneycomb,
  SynapseGetStartedMastheadSlot,
} from "@synapse/react/get-started";

export function Example() {
  return (
    <SynapseGetStarted>
      {/* project children / slots */}
    </SynapseGetStarted>
  );
}`;
