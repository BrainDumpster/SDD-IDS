/** Developer usage + Docs tab copy for Synapse Stepper (standalone). */

export const SYNAPSE_STEPPER_DOCS_DESCRIPTION = `
## Overview

Synapse Stepper is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/stepper\`.

## API

### Import

\`\`\`tsx
import { SynapseStepper } from "@synapse/react/stepper";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseStepper } from "@synapse/react/stepper";

export function Example() {
  return (
    <SynapseStepper steps={["Connect", "Configure", "Review"]} activeStep={1} />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_STEPPER_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseStepper } from "@synapse/react/stepper";

export function Example() {
  return (
    <SynapseStepper steps={["Connect", "Configure", "Review"]} activeStep={1} />
  );
}`;
