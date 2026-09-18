/** Developer usage + Docs tab copy for Synapse Recommendation Feedback (standalone). */

export const SYNAPSE_RECOMMENDATION_FEEDBACK_DOCS_DESCRIPTION = `
## Overview

Synapse Recommendation Feedback is Synapse-native (\`standalone\` strategy). There is no IDS counterpart.
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/recommendation-feedback\`.

## API

### Import

\`\`\`tsx
import { SynapseRecommendationFeedback } from "@synapse/react/recommendation-feedback";
\`\`\`

### Usage

\`\`\`tsx
import "components/synapse-theme.css";
import { SynapseRecommendationFeedback } from "@synapse/react/recommendation-feedback";

export function Example() {
  return (
    <SynapseRecommendationFeedback />
  );
}
\`\`\`
`.trim();

export const SYNAPSE_RECOMMENDATION_FEEDBACK_SOURCE_CODE = `import "components/synapse-theme.css";
import { SynapseRecommendationFeedback } from "@synapse/react/recommendation-feedback";

export function Example() {
  return (
    <SynapseRecommendationFeedback />
  );
}`;
