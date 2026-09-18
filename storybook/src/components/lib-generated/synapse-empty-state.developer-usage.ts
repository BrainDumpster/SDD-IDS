/** Developer usage + Docs tab copy for Synapse Empty State (standalone). */

export const SYNAPSE_EMPTY_STATE_DOCS_DESCRIPTION = `
## Overview

Synapse Empty State is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/empty-state\`.

## API

### Import

\`\`\`tsx
import { SynapseEmptyState } from "@synapse/react/empty-state";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseEmptyState } from "@synapse/react/empty-state";

export function Example() {
  return (
    <SynapseEmptyState title="No results" description="Try adjusting filters." />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_EMPTY_STATE_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseEmptyState } from "@synapse/react/empty-state";

export function Example() {
  return (
    <SynapseEmptyState title="No results" description="Try adjusting filters." />
  );
}`;
