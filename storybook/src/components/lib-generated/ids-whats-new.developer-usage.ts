/** Developer usage + Docs tab copy for IDS WhatsNew (React). */

export const WHATS_NEW_DOCS_DESCRIPTION = `
## Overview

Product release notes panel with sections, filters, and media.

\`\`\`
IdsWhatsNew
  IdsWhatsNewHeader
  IdsWhatsNewTitle
  IdsWhatsNewCloseButton
  IdsWhatsNewSummary
  IdsWhatsNewBody
  IdsWhatsNewVersionFilterRow
  IdsWhatsNewVersion
  IdsWhatsNewFilter
  IdsWhatsNewSectionsScroll
  IdsWhatsNewSection
  IdsWhatsNewThumbnail
  IdsWhatsNewSectionHeader
  IdsWhatsNewBookmarkButton
\`\`\`

Import from \`@ids/react/whats-new\`.

## Props

### \`IdsWhatsNewSectionInput\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`title\` | \`string\` | required |
| \`description\` | \`string\` | required |
| \`isBookmarked\` | \`boolean\` | — |
| \`images\` | \`IdsWhatsNewSectionImage[]\` | — |
| \`showMoreLabel\` | \`string\` | — |
| \`linkText\` | \`string\` | — |
| \`linkHref\` | \`string\` | — |

### \`IdsWhatsNewProps\`

| Prop | Type | Default |
|------|------|---------|
| \`open\` | \`boolean\` | — |
| \`title\` | \`string\` | — |
| \`description\` | \`string\` | — |
| \`versionNumber\` | \`string\` | — |
| \`filter\` | \`WhatsNewFilter\` | — |
| \`sections\` | \`IdsWhatsNewSectionInput[]\` | — |
| \`children\` | \`ReactNode\` | — |
| \`dontShowAgain\` | \`boolean\` | — |
| \`className\` | \`string\` | — |

### \`IdsWhatsNewTitleProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`id\` | \`string\` | — |

### \`IdsWhatsNewCloseButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsWhatsNewHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOpenChange\` | \`IdsWhatsNewProps\` | \`(open: boolean) => void\` |
| \`onFilterChange\` | \`IdsWhatsNewProps\` | \`(filter: WhatsNewFilter) => void\` |
| \`onDontShowAgainChange\` | \`IdsWhatsNewProps\` | \`(value: boolean) => void\` |
| \`onClose\` | \`IdsWhatsNewProps\` | \`() => void\` |
| \`onShowMore\` | \`IdsWhatsNewProps\` | \`(sectionId: string, expanded: boolean) => void\` |
| \`onSectionBookmarkChange\` | \`IdsWhatsNewProps\` | \`(sectionId: string, isBookmarked: boolean) => void\` |
| \`onThumbnailClick\` | \`IdsWhatsNewProps\` | \`(sectionId: string, imageId?: string) => void\` |
| \`onCarouselNavigate\` | \`IdsWhatsNewProps\` | \`(sectionId: string, index: number) => void\` |
| \`onExpandImage\` | \`IdsWhatsNewProps\` | \`(sectionId: string, imageId: string, index: number) => void\` |
| \`onCarouselClose\` | \`IdsWhatsNewProps\` | \`(sectionId: string) => void\` |
| \`onSinglePreviewClose\` | \`IdsWhatsNewProps\` | \`(sectionId: string, imageId: string, index: number) => void\` |
| \`onClick\` | \`IdsWhatsNewThumbnailProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsWhatsNew,
  IdsWhatsNewHeader,
  IdsWhatsNewTitle,
  IdsWhatsNewCloseButton,
  IdsWhatsNewSummary,
  IdsWhatsNewBody,
} from "@ids/react/whats-new";
\`\`\`

### Usage

\`\`\`tsx
<IdsWhatsNew>
  {/* project children / slots per anatomy */}
</IdsWhatsNew>
\`\`\`
`.trim();

export const WHATS_NEW_SOURCE_CODE = `import {
  IdsWhatsNew,
  IdsWhatsNewHeader,
  IdsWhatsNewTitle,
  IdsWhatsNewCloseButton,
  IdsWhatsNewSummary,
  IdsWhatsNewBody,
} from "@ids/react/whats-new";

export function Example() {
  return (
    <IdsWhatsNew>
      {/* project children / slots */}
    </IdsWhatsNew>
  );
}`;
