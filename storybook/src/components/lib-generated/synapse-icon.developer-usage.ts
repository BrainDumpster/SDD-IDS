/** Developer usage + Docs tab copy for Synapse Icon (React façade). */

export const SYNAPSE_ICON_DOCS_DESCRIPTION = `
## Overview

Synapse Icon is an IDS-fork façade over \`lib/react/ids/icon\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/icon\`.
`.trim();

export const SYNAPSE_ICON_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseIcon } from "@synapse/react/icon";

export function Example() {
  return (
    <SynapseIcon shape="settings-gear-detailed" size={16} />
  );
}`;
