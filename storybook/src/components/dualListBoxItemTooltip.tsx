import type { ReactNode } from "react";
import type { DualListBoxItem } from "./IdsDualListBox";
import {
  IdsTooltip,
  IdsTooltipArrow,
  IdsTooltipBody,
  IdsTooltipHeader,
  IdsTooltipPanel,
  IdsTooltipTitle,
  IdsTooltipTrigger,
} from "./IdsTooltip";

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

  const body = description || title;
  const headerTitle = title && description ? title : undefined;

  return (
    <IdsTooltip
      side={side}
      arrowAlign={arrowAlign}
      closable={false}
      triggerDisplay="block"
    >
      <IdsTooltipTrigger>{row}</IdsTooltipTrigger>
      <IdsTooltipPanel>
        {headerTitle ? (
          <IdsTooltipHeader>
            <IdsTooltipTitle>{headerTitle}</IdsTooltipTitle>
          </IdsTooltipHeader>
        ) : null}
        <IdsTooltipBody>{body}</IdsTooltipBody>
        <IdsTooltipArrow />
      </IdsTooltipPanel>
    </IdsTooltip>
  );
}
