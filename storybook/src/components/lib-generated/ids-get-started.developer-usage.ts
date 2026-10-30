/** Developer usage + Docs tab copy for IDS GetStarted (React). */

export const GET_STARTED_DOCS_DESCRIPTION = `
## Overview

Onboarding hero with module cards, configure actions, and optional masthead.

\`\`\`
IdsGetStarted
  IdsGetStartedHeroHeader
  IdsGetStartedHeroBackground
  IdsGetStartedHeroShadowBand
  IdsGetStartedHeroHoneycomb
  IdsGetStartedMastheadSlot
  IdsGetStartedHeroTitle
  IdsGetStartedHeroSubtitle
  IdsGetStartedContainer
  IdsGetStartedCardTrack
  IdsGetStartedCardAnchor
  IdsGetStartedCard
  IdsGetStartedCardIconBadge
  IdsGetStartedCardTitleBand
\`\`\`

Import from \`@ids/react/get-started\`.

## Props

### \`IdsGetStartedCardInput\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string \\| number\` | required |
| \`title\` | \`string\` | required |
| \`description\` | \`string\` | — |
| \`text\` | \`string\` | — |
| \`note\` | \`string\` | — |
| \`icon\` | \`string\` | — |
| \`iconShapeName\` | \`string\` | — |
| \`cardState\` | \`IdsGetStartedCardState\` | — |
| \`isDisabled\` | \`boolean\` | — |
| \`isRequired\` | \`boolean\` | — |
| \`isConfigured\` | \`boolean\` | — |
| \`actionButtonText\` | \`string\` | — |
| \`actionButtonTextIfConfigured\` | \`string\` | — |
| \`configureButtonTooltip\` | \`string\` | — |
| \`btnTooltip\` | \`string\` | — |

### \`IdsGetStartedMastheadProps\`

| Prop | Type | Default |
|------|------|---------|
| \`productName\` | \`ReactNode\` | — |
| \`logo\` | \`ReactNode\` | — |
| \`iconsSlot\` | \`ReactNode\` | — |
| \`avatarSlot\` | \`ReactNode\` | — |

### \`IdsGetStartedProps\`

| Prop | Type | Default |
|------|------|---------|
| \`title\` | \`string\` | — |
| \`bannerTitle\` | \`string\` | — |
| \`subtitle\` | \`string\` | — |
| \`bannerDescription\` | \`string\` | — |
| \`cards\` | \`IdsGetStartedCardInput[]\` | — |
| \`overflow\` | \`boolean\` | — |
| \`sequential\` | \`boolean\` | — |
| \`overflowPage\` | \`IdsGetStartedOverflowPage\` | — |
| \`showMasthead\` | \`boolean\` | — |
| \`isHeaderRequired\` | \`boolean\` | — |
| \`headerActionsDisabled\` | \`boolean\` | — |
| \`productName\` | \`string\` | — |
| \`mastheadProps\` | \`IdsGetStartedMastheadProps\` | — |
| \`mastheadSlot\` | \`ReactNode\` | — |
| \`skipButtonText\` | \`string\` | — |
| \`launchButtonText\` | \`string\` | — |
| \`skipButtonTooltip\` | \`string\` | — |
| \`launchButtonTooltip\` | \`string\` | — |

### \`IdsGetStartedHeroBackgroundProps\`

| Prop | Type | Default |
|------|------|---------|
| \`className\` | \`string\` | — |

### \`IdsGetStartedHeroShadowBandProps\`

| Prop | Type | Default |
|------|------|---------|
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onConfigure\` | \`IdsGetStartedProps\` | \`(card: IdsGetStartedCardInput) => void\` |
| \`onSkip\` | \`IdsGetStartedProps\` | \`() => void\` |
| \`onOverflowNavigate\` | \`IdsGetStartedProps\` | \`(direction: "prev" \\| "next") => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsGetStarted,
  IdsGetStartedHeroHeader,
  IdsGetStartedHeroBackground,
  IdsGetStartedHeroShadowBand,
  IdsGetStartedHeroHoneycomb,
  IdsGetStartedMastheadSlot,
} from "@ids/react/get-started";
\`\`\`

### Usage

\`\`\`tsx
<IdsGetStarted>
  {/* project children / slots per anatomy */}
</IdsGetStarted>
\`\`\`
`.trim();

export const GET_STARTED_SOURCE_CODE = `import {
  IdsGetStarted,
  IdsGetStartedHeroHeader,
  IdsGetStartedHeroBackground,
  IdsGetStartedHeroShadowBand,
  IdsGetStartedHeroHoneycomb,
  IdsGetStartedMastheadSlot,
} from "@ids/react/get-started";

export function Example() {
  return (
    <IdsGetStarted>
      {/* project children / slots */}
    </IdsGetStarted>
  );
}`;
