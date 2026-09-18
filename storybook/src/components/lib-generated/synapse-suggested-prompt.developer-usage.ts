/** Developer usage + Docs tab copy for Synapse Suggested Prompt (standalone). */

export const SYNAPSE_SUGGESTED_PROMPT_DOCS_DESCRIPTION = `
## Overview

Synapse Suggested Prompt is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/suggested-prompt\`.

## API

### Import

\`\`\`tsx
import { SynapseSuggestedPrompt } from "@synapse/react/suggested-prompt";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseSuggestedPrompt } from "@synapse/react/suggested-prompt";

export function Example() {
  return (
    <SynapseSuggestedPrompt label="Summarize the health of my environment" icon />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_SUGGESTED_PROMPT_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseSuggestedPrompt } from "@synapse/react/suggested-prompt";

export function Example() {
  return (
    <SynapseSuggestedPrompt label="Summarize the health of my environment" icon />
  );
}`;
