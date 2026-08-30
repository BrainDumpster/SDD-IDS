/** Developer usage + Docs tab copy for IDS Pagination (React). */

export const PAGINATION_DOCS_DESCRIPTION = `
## Overview

Page navigation control for large datasets.

Import from \`@ids/react/pagination\`.

## Props

### \`IdsPaginationProps\`

| Prop | Type | Default |
|------|------|---------|
| \`currentPage\` | \`number\` | required |
| \`totalPages\` | \`number\` | required |
| \`pageSize\` | \`number\` | — |
| \`pageSizeOptions\` | \`number[]\` | — |
| \`showResultsPerPage\` | \`boolean\` | — |
| \`background\` | \`IdsPaginationBackground\` | — |
| \`disabled\` | \`boolean\` | — |
| \`summaryFormatter\` | \`(currentPage: number, totalPages: number) => string\` | — |
| \`responsiveMode\` | \`IdsPaginationResponsiveMode\` | — |
| \`collapseOrder\` | \`IdsPaginationCollapseSlot[]\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onPageChange\` | \`IdsPaginationProps\` | \`(page: number) => void\` |
| \`onPageSizeChange\` | \`IdsPaginationProps\` | \`(size: number) => void\` |

## API

### Import

\`\`\`tsx
import { IdsPagination } from "@ids/react/pagination";
\`\`\`

### Usage

\`\`\`tsx
<IdsPagination>
  {/* project children / slots per anatomy */}
</IdsPagination>
\`\`\`
`.trim();

export const PAGINATION_SOURCE_CODE = `import { IdsPagination } from "@ids/react/pagination";

export function Example() {
  return (
    <IdsPagination>
      {/* project children / slots */}
    </IdsPagination>
  );
}`;
