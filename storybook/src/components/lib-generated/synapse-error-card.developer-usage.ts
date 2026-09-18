/** Developer usage + Docs tab copy for Synapse Error Card (standalone). */

export const SYNAPSE_ERROR_CARD_DOCS_DESCRIPTION = `
## Overview

Synapse Error Card is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/error-card\`.

## API

### Import

\`\`\`tsx
import { SynapseErrorCard } from "@synapse/react/error-card";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseErrorCard } from "@synapse/react/error-card";

export function Example() {
  return (
    <SynapseErrorCard title="Unable to load data" message="The request failed." />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_ERROR_CARD_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseErrorCard } from "@synapse/react/error-card";

export function Example() {
  return (
    <SynapseErrorCard title="Unable to load data" message="The request failed." />
  );
}`;
