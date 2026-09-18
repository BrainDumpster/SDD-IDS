/** Developer usage + Docs tab copy for Synapse Helper (React façade). */

export const SYNAPSE_HELPER_DOCS_DESCRIPTION = `
## Overview

Synapse Helper is an IDS-fork façade over \`lib/react/ids/helper\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/helper\`.
`.trim();

export const SYNAPSE_HELPER_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseHelper } from "@synapse/react/helper";

export function Example() {
  return (
    <SynapseHelper><SynapseHelperText>Helper text</SynapseHelperText></SynapseHelper>
  );
}`;
