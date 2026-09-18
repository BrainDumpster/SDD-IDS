/** Developer usage + Docs tab copy for Synapse Thinking (standalone). */

export const SYNAPSE_THINKING_DOCS_DESCRIPTION = `
## Overview

Synapse Thinking is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/thinking\`.

## API

### Import

\`\`\`tsx
import { SynapseThinking } from "@synapse/react/thinking";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseThinking } from "@synapse/react/thinking";

export function Example() {
  return (
    <SynapseThinking variant="spinner" label="Collecting information" />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_THINKING_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseThinking } from "@synapse/react/thinking";

export function Example() {
  return (
    <SynapseThinking variant="spinner" label="Collecting information" />
  );
}`;
