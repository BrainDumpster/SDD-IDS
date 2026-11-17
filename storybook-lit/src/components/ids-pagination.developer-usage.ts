/** Developer usage + Docs tab copy for IDS Lit Pagination. */

export const PAGINATION_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-pagination\` — page navigation control from \`components/ids/pagination/design-spec.md\`.

API aligned with React \`@ids/react/pagination\` (\`IdsPagination\` prop/event contract).
Story examples mirror \`storybook/src/components/lib-generated/Pagination.stories.tsx\`.

\`\`\`
ids-pagination
  ResultsPerPageGroup?  (Show: + per-page dropdown + per page)
  PageNavigationGroup   (first / prev / page input / of N / next / last)
\`\`\`

## Props

| Prop | Attribute / binding | Type | Default |
|------|---------------------|------|---------|
| \`currentPage\` | \`currentpage\` | \`number\` | \`1\` |
| \`totalPages\` | \`totalpages\` | \`number\` | \`1\` |
| \`pageSize\` | \`pagesize\` | \`number\` | \`25\` |
| \`pageSizeOptions\` | \`.pageSizeOptions=\` | \`number[]\` | \`[25, 50, 75, 100]\` |
| \`showResultsPerPage\` | \`showresultsperpage\` | \`boolean\` | \`true\` |
| \`background\` | \`background\` | \`"gray" \\| "white" \\| "none"\` | \`"gray"\` |
| \`embeddedInDatagrid\` | \`embeddedindatagrid\` | \`boolean\` | \`false\` (datagrid footer sets \`true\`) |
| \`responsiveMode\` | \`responsivemode\` | \`"auto" \\| "keep-inline"\` | \`"auto"\` |
| \`collapseOrder\` | \`.collapseOrder=\` | \`IdsPaginationCollapseSlot[]\` | \`["results-per-page"]\` |
| \`summaryFormatter\` | property | \`(page, total) => string\` | — |
| \`ariaLabel\` | \`arialabel\` | \`string\` | \`"Pagination"\` |
| \`onPageChange\` | property | \`(page) => void\` | — |
| \`onPageSizeChange\` | property | \`(size) => void\` | — |

## Events

| Event | Detail |
|-------|--------|
| \`page-change\` / \`onPageChange\` | \`number\` (1-based page) |
| \`page-size-change\` / \`onPageSizeChange\` | \`number\` (selected page size) |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const PAGINATION_SOURCE_CODE = `<ids-pagination
  currentpage="1"
  totalpages="16"
  pagesize="25"
  .pageSizeOptions=\${[25, 50, 75, 100]}
  showresultsperpage="true"
  background="gray"
  responsivemode="auto"
></ids-pagination>`;
