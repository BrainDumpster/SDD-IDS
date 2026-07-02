import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

/** Optional tooltip header slot — Body 2 Medium (`Header` in design spec). */
export function IdsTooltipTitle({ children }: { children?: ReactNode }) {
  return null;
}
IdsTooltipTitle.displayName = "IdsTooltipTitle";

/** Required tooltip body slot — maps to spec `BodyContent`. */
export function IdsTooltipBody({ children }: { children?: ReactNode }) {
  return null;
}
IdsTooltipBody.displayName = "IdsTooltipBody";

export type ParsedTooltipChildren = {
  trigger: ReactNode;
  titleSlot?: ReactNode;
  bodySlot?: ReactNode;
  hasTitleSlot: boolean;
  hasBodySlot: boolean;
};

function isTooltipTitleElement(child: ReactNode): child is ReactElement<{ children?: ReactNode }> {
  return isValidElement(child) && child.type === IdsTooltipTitle;
}

function isTooltipBodyElement(child: ReactNode): child is ReactElement<{ children?: ReactNode }> {
  return isValidElement(child) && child.type === IdsTooltipBody;
}

/** Split trigger / title / body children for IDS Tooltip composition API. */
export function parseTooltipChildren(children: ReactNode): ParsedTooltipChildren {
  const triggerNodes: ReactNode[] = [];
  let titleSlot: ReactNode | undefined;
  let bodySlot: ReactNode | undefined;
  let hasTitleSlot = false;
  let hasBodySlot = false;

  Children.forEach(children, (child) => {
    if (isTooltipTitleElement(child)) {
      hasTitleSlot = true;
      titleSlot = child.props.children;
      return;
    }
    if (isTooltipBodyElement(child)) {
      hasBodySlot = true;
      bodySlot = child.props.children;
      return;
    }
    if (child == null || child === false) {
      return;
    }
    triggerNodes.push(child);
  });

  const trigger =
    triggerNodes.length <= 1 ? (triggerNodes[0] ?? null) : <>{triggerNodes}</>;

  return {
    trigger,
    titleSlot,
    bodySlot,
    hasTitleSlot,
    hasBodySlot,
  };
}
