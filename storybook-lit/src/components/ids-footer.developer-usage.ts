/** Developer usage + Docs tab copy for IDS Lit Footer. */

export const FOOTER_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-footer\` — application status bar from \`components/ids/footer/design-spec.md\`.

API aligned with React \`@ids/react/footer\` (\`IdsFooter\` prop/event contract).
Angular composition children (\`ids-footer-left-region\`, \`ids-footer-host-name\`, …)
live under \`lib/angular/ids/footer/\`; Lit matches the React runtime props used by
Spec Accurate Design.

\`\`\`
ids-footer
  left: Host Name? + SWID + copy
  right: Time? + Time Zone?
\`\`\`

## Props

| Prop | Attribute / binding | Type | Default |
|------|---------------------|------|---------|
| \`hostname\` | \`hostname\` | \`string\` | — |
| \`swid\` | \`swid\` | \`string\` | — |
| \`currentDateTime\` | \`currentdatetime\` | \`string\` | — |
| \`timeZoneLabel\` | \`timezonelabel\` | \`string\` | — |
| \`showHostname\` | \`.showHostname=\` | \`boolean\` | \`true\` |
| \`showCurrentDateAndTime\` | \`.showCurrentDateAndTime=\` | \`boolean\` | \`true\` |
| \`showTimeZone\` | \`.showTimeZone=\` | \`boolean\` | \`true\` |
| \`copyDisabled\` | \`copydisabled\` | \`boolean\` | \`false\` |
| \`timeZoneDisabled\` | \`timezonedisabled\` | \`boolean\` | \`false\` |
| \`ariaLabel\` | \`arialabel\` | \`string\` | \`Application status\` |
| \`onCopySwid\` | property | \`(swid) => void\` | — |
| \`onTimeZoneClick\` | property | \`() => void\` | — |

## Events

| Event | Detail |
|-------|--------|
| \`copy-swid\` / \`onCopySwid\` | SWID string |
| \`time-zone-click\` / \`onTimeZoneClick\` | — |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const FOOTER_SOURCE_CODE = `<ids-footer
  hostname="short_name_first_domain_name"
  swid="ELMCR00222GBPB"
  currentdatetime="Tue, 2023-04-23 12:30 AM"
  timezonelabel="Eastern Time (US & Canada)"
  .showHostname=\${true}
  .showCurrentDateAndTime=\${true}
  .showTimeZone=\${true}
></ids-footer>`;
