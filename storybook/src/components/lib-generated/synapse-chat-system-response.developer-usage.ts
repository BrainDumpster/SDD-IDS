/** Developer usage + Docs tab copy for Synapse Chat System Response (standalone). */

export const SYNAPSE_CHAT_SYSTEM_RESPONSE_DOCS_DESCRIPTION = `
## Overview

Synapse Chat System Response is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/chat-system-response\`.

## API

### Import

\`\`\`tsx
import { SynapseChatSystemResponse } from "@synapse/react/chat-system-response";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseChatSystemResponse } from "@synapse/react/chat-system-response";

export function Example() {
  return (
    <SynapseChatSystemResponse content="I found 3 clusters that need attention." />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_CHAT_SYSTEM_RESPONSE_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseChatSystemResponse } from "@synapse/react/chat-system-response";

export function Example() {
  return (
    <SynapseChatSystemResponse content="I found 3 clusters that need attention." />
  );
}`;
