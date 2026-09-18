/** Developer usage + Docs tab copy for Synapse Tracker (standalone). */

export const SYNAPSE_TRACKER_DOCS_DESCRIPTION = `
## Overview

Synapse Tracker is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/tracker\`.

## API

### Import

\`\`\`tsx
import { SynapseTracker } from "@synapse/react/tracker";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseTracker } from "@synapse/react/tracker";

export function Example() {
  return (
    <SynapseTracker items={[{ label: "Discover", status: "complete" }]} />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_TRACKER_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseTracker } from "@synapse/react/tracker";

export function Example() {
  return (
    <SynapseTracker items={[{ label: "Discover", status: "complete" }]} />
  );
}`;
