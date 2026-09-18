/** Developer usage + Docs tab copy for IDS WhatsNew (React). */

export const SYNAPSE_WHATS_NEW_DOCS_DESCRIPTION = `
## Overview

Synapse Whats New is an IDS-fork façade over \`lib/react/ids/whats-new\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/whats-new\`.

Product release notes panel with sections, filters, and media.

\`\`\`
SynapseWhatsNew
  SynapseWhatsNewHeader
  SynapseWhatsNewTitle
  SynapseWhatsNewCloseButton
  SynapseWhatsNewSummary
  SynapseWhatsNewBody
  SynapseWhatsNewVersionFilterRow
  SynapseWhatsNewVersion
  SynapseWhatsNewFilter
  SynapseWhatsNewSectionsScroll
  SynapseWhatsNewSection
  SynapseWhatsNewThumbnail
  SynapseWhatsNewSectionHeader
  SynapseWhatsNewBookmarkButton
\`\`\`

Import from \`@synapse/react/whats-new\`.

## Props

### \`SynapseWhatsNewSectionInput\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`title\` | \`string\` | required |
| \`description\` | \`string\` | required |
| \`isBookmarked\` | \`boolean\` | — |
| \`images\` | \`SynapseWhatsNewSectionImage[]\` | — |
| \`showMoreLabel\` | \`string\` | — |
| \`linkText\` | \`string\` | — |
| \`linkHref\` | \`string\` | — |

### \`SynapseWhatsNewProps\`

| Prop | Type | Default |
|------|------|---------|
| \`open\` | \`boolean\` | — |
| \`title\` | \`string\` | — |
| \`description\` | \`string\` | — |
| \`versionNumber\` | \`string\` | — |
| \`filter\` | \`WhatsNewFilter\` | — |
| \`sections\` | \`SynapseWhatsNewSectionInput[]\` | — |
| \`children\` | \`ReactNode\` | — |
| \`dontShowAgain\` | \`boolean\` | — |
| \`className\` | \`string\` | — |

### \`SynapseWhatsNewTitleProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`id\` | \`string\` | — |

### \`SynapseWhatsNewCloseButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseWhatsNewHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOpenChange\` | \`SynapseWhatsNewProps\` | \`(open: boolean) => void\` |
| \`onFilterChange\` | \`SynapseWhatsNewProps\` | \`(filter: WhatsNewFilter) => void\` |
| \`onDontShowAgainChange\` | \`SynapseWhatsNewProps\` | \`(value: boolean) => void\` |
| \`onClose\` | \`SynapseWhatsNewProps\` | \`() => void\` |
| \`onShowMore\` | \`SynapseWhatsNewProps\` | \`(sectionId: string, expanded: boolean) => void\` |
| \`onSectionBookmarkChange\` | \`SynapseWhatsNewProps\` | \`(sectionId: string, isBookmarked: boolean) => void\` |
| \`onThumbnailClick\` | \`SynapseWhatsNewProps\` | \`(sectionId: string, imageId?: string) => void\` |
| \`onCarouselNavigate\` | \`SynapseWhatsNewProps\` | \`(sectionId: string, index: number) => void\` |
| \`onExpandImage\` | \`SynapseWhatsNewProps\` | \`(sectionId: string, imageId: string, index: number) => void\` |
| \`onCarouselClose\` | \`SynapseWhatsNewProps\` | \`(sectionId: string) => void\` |
| \`onSinglePreviewClose\` | \`SynapseWhatsNewProps\` | \`(sectionId: string, imageId: string, index: number) => void\` |
| \`onClick\` | \`SynapseWhatsNewThumbnailProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseWhatsNew,
  SynapseWhatsNewHeader,
  SynapseWhatsNewTitle,
  SynapseWhatsNewCloseButton,
  SynapseWhatsNewSummary,
  SynapseWhatsNewBody,
} from "@synapse/react/whats-new";
\`\`\`

### Usage

\`\`\`tsx
<SynapseWhatsNew>
  {/* project children / slots per anatomy */}
</SynapseWhatsNew>
\`\`\`
`.trim();

export const SYNAPSE_WHATS_NEW_SOURCE_CODE = `import {
  SynapseWhatsNew,
  SynapseWhatsNewHeader,
  SynapseWhatsNewTitle,
  SynapseWhatsNewCloseButton,
  SynapseWhatsNewSummary,
  SynapseWhatsNewBody,
} from "@synapse/react/whats-new";

export function Example() {
  return (
    <SynapseWhatsNew>
      {/* project children / slots */}
    </SynapseWhatsNew>
  );
}`;
