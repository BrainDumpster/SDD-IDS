/** Developer usage + Docs tab copy for Synapse Chat Area (standalone). */

export const SYNAPSE_CHAT_AREA_DOCS_DESCRIPTION = `
## Overview

Synapse Chat Area is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/chat-area\`.

## API

### Import

\`\`\`tsx
import { SynapseChatArea } from "@synapse/react/chat-area";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseChatArea } from "@synapse/react/chat-area";

export function Example() {
  return (
    <SynapseChatArea messages={[{ id: "1", sender: "user", content: "Hello" }]} />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_CHAT_AREA_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseChatArea } from "@synapse/react/chat-area";

export function Example() {
  return (
    <SynapseChatArea messages={[{ id: "1", sender: "user", content: "Hello" }]} />
  );
}`;
