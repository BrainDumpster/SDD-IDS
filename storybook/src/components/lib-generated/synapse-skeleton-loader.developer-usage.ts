/** Developer usage + Docs tab copy for Synapse Skeleton Loader (standalone). */

export const SYNAPSE_SKELETON_LOADER_DOCS_DESCRIPTION = `
## Overview

Synapse Skeleton Loader is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/skeleton-loader\`.

## API

### Import

\`\`\`tsx
import { SynapseSkeletonLoader } from "@synapse/react/skeleton-loader";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseSkeletonLoader } from "@synapse/react/skeleton-loader";

export function Example() {
  return (
    <SynapseSkeletonLoader variant="text" lines={3} />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_SKELETON_LOADER_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseSkeletonLoader } from "@synapse/react/skeleton-loader";

export function Example() {
  return (
    <SynapseSkeletonLoader variant="text" lines={3} />
  );
}`;
