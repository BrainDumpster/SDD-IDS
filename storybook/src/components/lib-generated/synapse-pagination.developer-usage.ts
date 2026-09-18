/** Developer usage + Docs tab copy for IDS Pagination (React). */

export const SYNAPSE_PAGINATION_DOCS_DESCRIPTION = `
## Overview

Synapse Pagination is an IDS-fork façade over \`lib/react/ids/pagination\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/pagination\`.

Page navigation control for large datasets.

Import from \`@synapse/react/pagination\`.

## Props

### \`SynapsePaginationProps\`

| Prop | Type | Default |
|------|------|---------|
| \`currentPage\` | \`number\` | required |
| \`totalPages\` | \`number\` | required |
| \`pageSize\` | \`number\` | — |
| \`pageSizeOptions\` | \`number[]\` | — |
| \`showResultsPerPage\` | \`boolean\` | — |
| \`background\` | \`SynapsePaginationBackground\` | — |
| \`disabled\` | \`boolean\` | — |
| \`summaryFormatter\` | \`(currentPage: number, totalPages: number) => string\` | — |
| \`responsiveMode\` | \`SynapsePaginationResponsiveMode\` | — |
| \`collapseOrder\` | \`SynapsePaginationCollapseSlot[]\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onPageChange\` | \`SynapsePaginationProps\` | \`(page: number) => void\` |
| \`onPageSizeChange\` | \`SynapsePaginationProps\` | \`(size: number) => void\` |

## API

### Import

\`\`\`tsx
import { SynapsePagination } from "@synapse/react/pagination";
\`\`\`

### Usage

\`\`\`tsx
<SynapsePagination>
  {/* project children / slots per anatomy */}
</SynapsePagination>
\`\`\`
`.trim();

export const SYNAPSE_PAGINATION_SOURCE_CODE = `import { SynapsePagination } from "@synapse/react/pagination";

export function Example() {
  return (
    <SynapsePagination>
      {/* project children / slots */}
    </SynapsePagination>
  );
}`;
