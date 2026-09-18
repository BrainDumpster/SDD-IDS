/** Developer usage + Docs tab copy for Synapse Error (React façade). */

export const SYNAPSE_ERROR_DOCS_DESCRIPTION = `
## Overview

Synapse Error is an IDS-fork façade over \`lib/react/ids/error\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/error\`.
`.trim();

export const SYNAPSE_ERROR_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseError } from "@synapse/react/error";

export function Example() {
  return (
    <SynapseError><SynapseErrorText>Error text</SynapseErrorText></SynapseError>
  );
}`;
