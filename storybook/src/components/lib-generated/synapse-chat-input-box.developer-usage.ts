/** Developer usage + Docs tab copy for Synapse Chat Input Box (standalone). */

export const SYNAPSE_CHAT_INPUT_BOX_DOCS_DESCRIPTION = `
## Overview

Synapse Chat Input Box is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/chat-input-box\`.

## API

### Import

\`\`\`tsx
import { SynapseChatInputBox } from "@synapse/react/chat-input-box";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseChatInputBox } from "@synapse/react/chat-input-box";

export function Example() {
  return (
    <SynapseChatInputBox placeholder="Ask me anything" />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_CHAT_INPUT_BOX_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseChatInputBox } from "@synapse/react/chat-input-box";

export function Example() {
  return (
    <SynapseChatInputBox placeholder="Ask me anything" />
  );
}`;
