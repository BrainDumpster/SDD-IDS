/** Developer usage + Docs tab copy for IDS Pagination (Angular). */

export const PAGINATION_DOCS_DESCRIPTION = `
## Overview

Page navigation control for large datasets.

## Props

### \`ids-pagination\`

| Input | Type | Default |
|-------|------|---------|
| \`currentPage\` | \`-\` | \`PAGINATION_SPEC_ACCURATE_DEFAULTS...\` |
| \`totalPages\` | \`-\` | \`PAGINATION_SPEC_ACCURATE_DEFAULTS...\` |
| \`pageSize\` | \`-\` | \`PAGINATION_SPEC_ACCURATE_DEFAULTS...\` |
| \`pageSizeOptions\` | \`number[]\` | \`[ ...PAGINATION_SPEC_ACCURATE_DEF...\` |
| \`showPerPage\` | \`-\` | \`PAGINATION_SPEC_ACCURATE_DEFAULTS...\` |
| \`showFirstLast\` | \`-\` | \`PAGINATION_SPEC_ACCURATE_DEFAULTS...\` |
| \`dropdownState\` | \`IdsPaginationDropdownState\` | \`PAGINATION_SPEC_ACCURATE_DEFAULTS...\` |
| \`background\` | \`IdsPaginationBackground\` | \`PAGINATION_SPEC_ACCURATE_DEFAULTS...\` |
| \`embeddedInDatagrid\` | \`-\` | \`false\` |
| \`disabled\` | \`-\` | \`PAGINATION_SPEC_ACCURATE_DEFAULTS...\` |
| \`responsiveMode\` | \`IdsPaginationResponsiveMode\` | \`PAGINATION_SPEC_ACCURATE_DEFAULTS...\` |
| \`collapseOrder\` | \`IdsPaginationCollapseSlot[]\` | \`[ ...PAGINATION_SPEC_ACCURATE_DEF...\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`pageChange\` | \`ids-pagination\` | \`number\` |
| \`pageSizeChange\` | \`ids-pagination\` | \`number\` |
| \`firstPageNavigate\` | \`ids-pagination\` | \`void\` |
| \`previousPageNavigate\` | \`ids-pagination\` | \`void\` |
| \`nextPageNavigate\` | \`ids-pagination\` | \`void\` |
| \`lastPageNavigate\` | \`ids-pagination\` | \`void\` |

## API

Import from \`@ids/angular/pagination\` (or the component imports barrel).

\`\`\`ts
import { IdsPaginationComponent } from "@ids/angular/pagination";
\`\`\`
`.trim();

export const PAGINATION_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IdsPaginationComponent } from "@ids/angular/pagination";

@Component({
  standalone: true,
  imports: [IdsPaginationComponent],
  template: \`<ids-pagination></ids-pagination>\`,
})
export class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});`;

export const PAGINATION_STORY_SOURCE_CODE = `<ids-pagination></ids-pagination>`;
