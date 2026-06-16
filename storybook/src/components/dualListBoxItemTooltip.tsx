import type { ReactNode } from "react";
import type { DualListBoxItem } from "./IdsDualListBox";
import { IdsTooltip } from "./IdsTooltip";

/** IDS Tooltip contract: `components/ids/tooltip/design-spec.md` */
export const IDS_TOOLTIP_SPEC_PATH = "components/ids/tooltip/design-spec.md";

export type DualListBoxItemTooltipOptions = {
  side?: "top" | "bottom" | "left" | "right";
  arrowAlign?: "start" | "center" | "end";
};

export function hasDualListBoxItemTooltip(item: DualListBoxItem): boolean {
  return Boolean(item.tooltipTitle?.trim() || item.tooltipDescription?.trim());
}

/**
 * Wraps a list row with {@link IdsTooltip} when `tooltipTitle` and/or `tooltipDescription` are set.
 * Mapping follows IDS Tooltip spec (standard mode: `closable=false`, arrow always rendered, `sideOffset=16`).
 */
export function wrapDualListBoxItemWithIdsTooltip(
  item: DualListBoxItem,
  row: ReactNode,
  options: DualListBoxItemTooltipOptions = {},
): ReactNode {
  if (!hasDualListBoxItemTooltip(item)) {
    return row;
  }

  const title = item.tooltipTitle?.trim();
  const description = item.tooltipDescription?.trim();
  const side = options.side ?? "top";
  const arrowAlign = options.arrowAlign ?? "center";

  // Title + description → header + body (With header variant).
  if (title && description) {
    return (
      <IdsTooltip
        title={title}
        content={description}
        side={side}
        arrowAlign={arrowAlign}
        closable={false}
        triggerDisplay="block"
      >
        {row}
      </IdsTooltip>
    );
  }

  // Description only → standard tooltip (body only).
  if (description) {
    return (
      <IdsTooltip
        content={description}
        side={side}
        arrowAlign={arrowAlign}
        closable={false}
        triggerDisplay="block"
      >
        {row}
      </IdsTooltip>
    );
  }

  // Title only → standard tooltip (body only; omit empty header per spec).
  return (
    <IdsTooltip
      content={title}
      side={side}
      arrowAlign={arrowAlign}
      closable={false}
      triggerDisplay="block"
    >
      {row}
    </IdsTooltip>
  );
}
