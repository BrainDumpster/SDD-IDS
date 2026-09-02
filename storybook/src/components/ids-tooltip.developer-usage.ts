/** Developer usage + Docs tab copy for IDS Tooltip (React, composition API). */

export const TOOLTIP_DOCS_DESCRIPTION = `
IDS Tooltip — React **composition** API (\`storybook/src/components/IdsTooltip.tsx\`).

**Spec:** \`components/ids/tooltip/design-spec.md\`  
**Contract defaults:** \`component-contracts/ids/tooltip.contract.ts\`

### Anatomy (deterministic child order)

\`\`\`
IdsTooltip [side, arrowAlign, closable, …]
  IdsTooltipTrigger
  IdsTooltipPanel
    IdsTooltipHeader
      IdsTooltipTitle
    IdsTooltipBody
    IdsTooltipClose
    IdsTooltipArrow
\`\`\`

String props (\`title\`, \`content\`) remain **shorthand** for Storybook controls when slots are not used.

Load \`components/ids-theme.css\` on the app root (\`data-design-system="ids"\`).
`.trim();

export const TOOLTIP_STORY_CANVAS_STYLE = {
  display: "flex",
  minHeight: 180,
  alignItems: "center",
  justifyContent: "center",
  padding: 32,
  overflow: "visible",
} as const;

export const TOOLTIP_DOCS_CANVAS_STYLE = {
  display: "flex",
  minHeight: 300,
  alignItems: "center",
  justifyContent: "center",
  padding: "96px 32px 48px",
  overflow: "visible",
  boxSizing: "border-box" as const,
};

export const TOOLTIP_MATRIX_GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
  gap: 20,
  padding: 24,
  minWidth: 720,
  boxSizing: "border-box" as const,
  overflow: "visible",
};

export const TOOLTIP_MATRIX_CELL_STYLE = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "72px 48px",
  overflow: "visible",
  minHeight: 200,
};

export const TOOLTIP_STORY_SOURCE_CODE = `<IdsTooltip side="top" arrowAlign="start" closable={false}>
  <IdsTooltipTrigger>
    <Button variant="secondary" size="lg">Hover over me</Button>
  </IdsTooltipTrigger>
  <IdsTooltipPanel>
    <IdsTooltipHeader>
      <IdsTooltipTitle>Tooltip Title</IdsTooltipTitle>
    </IdsTooltipHeader>
    <IdsTooltipBody>
      Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu.
    </IdsTooltipBody>
    <IdsTooltipArrow />
  </IdsTooltipPanel>
</IdsTooltip>`;
