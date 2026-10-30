import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

export function IdsTooltipTrigger({ children }: { children?: ReactNode }) {
  return null;
}
IdsTooltipTrigger.displayName = "IdsTooltipTrigger";

export function IdsTooltipPanel({ children }: { children?: ReactNode }) {
  return null;
}
IdsTooltipPanel.displayName = "IdsTooltipPanel";

export function IdsTooltipHeader({ children }: { children?: ReactNode }) {
  return null;
}
IdsTooltipHeader.displayName = "IdsTooltipHeader";

export function IdsTooltipTitle({ children }: { children?: ReactNode }) {
  return null;
}
IdsTooltipTitle.displayName = "IdsTooltipTitle";

export function IdsTooltipBody({ children }: { children?: ReactNode }) {
  return null;
}
IdsTooltipBody.displayName = "IdsTooltipBody";

export function IdsTooltipClose({ children }: { children?: ReactNode }) {
  return null;
}
IdsTooltipClose.displayName = "IdsTooltipClose";

export function IdsTooltipArrow({ children }: { children?: ReactNode }) {
  return null;
}
IdsTooltipArrow.displayName = "IdsTooltipArrow";

export type ParsedTooltipChildren = {
  trigger: ReactNode;
  titleSlot?: ReactNode;
  bodySlot?: ReactNode;
  hasTitleSlot: boolean;
  hasBodySlot: boolean;
};

function isType(child: ReactNode, type: unknown): child is ReactElement<{ children?: ReactNode }> {
  return isValidElement(child) && child.type === type;
}

function parsePanelChildren(children: ReactNode): Pick<
  ParsedTooltipChildren,
  "titleSlot" | "bodySlot" | "hasTitleSlot" | "hasBodySlot"
> {
  let titleSlot: ReactNode | undefined;
  let bodySlot: ReactNode | undefined;
  let hasTitleSlot = false;
  let hasBodySlot = false;

  Children.forEach(children, (child) => {
    if (isType(child, IdsTooltipHeader)) {
      Children.forEach(child.props.children, (headerChild) => {
        if (isType(headerChild, IdsTooltipTitle)) {
          hasTitleSlot = true;
          titleSlot = headerChild.props.children;
        }
      });
      return;
    }
    if (isType(child, IdsTooltipTitle)) {
      hasTitleSlot = true;
      titleSlot = child.props.children;
      return;
    }
    if (isType(child, IdsTooltipBody)) {
      hasBodySlot = true;
      bodySlot = child.props.children;
    }
  });

  return { titleSlot, bodySlot, hasTitleSlot, hasBodySlot };
}

/** Split trigger / panel slots for IDS Tooltip composition API. */
export function parseTooltipChildren(children: ReactNode): ParsedTooltipChildren {
  const triggerNodes: ReactNode[] = [];
  let titleSlot: ReactNode | undefined;
  let bodySlot: ReactNode | undefined;
  let hasTitleSlot = false;
  let hasBodySlot = false;
  let sawTrigger = false;
  let sawPanel = false;

  Children.forEach(children, (child) => {
    if (isType(child, IdsTooltipTrigger)) {
      sawTrigger = true;
      triggerNodes.push(child.props.children);
      return;
    }
    if (isType(child, IdsTooltipPanel)) {
      sawPanel = true;
      const parsed = parsePanelChildren(child.props.children);
      hasTitleSlot = parsed.hasTitleSlot;
      hasBodySlot = parsed.hasBodySlot;
      titleSlot = parsed.titleSlot;
      bodySlot = parsed.bodySlot;
      return;
    }
    if (isType(child, IdsTooltipTitle) || isType(child, IdsTooltipHeader) || isType(child, IdsTooltipBody)) {
      const parsed = parsePanelChildren(children);
      hasTitleSlot = parsed.hasTitleSlot;
      hasBodySlot = parsed.hasBodySlot;
      titleSlot = parsed.titleSlot;
      bodySlot = parsed.bodySlot;
      return;
    }
    if (isType(child, IdsTooltipClose) || isType(child, IdsTooltipArrow)) {
      return;
    }
    if (child == null || child === false) {
      return;
    }
    if (!sawTrigger) {
      triggerNodes.push(child);
    }
  });

  if (!sawPanel && (hasTitleSlot || hasBodySlot) === false) {
    const parsed = parsePanelChildren(children);
    hasTitleSlot = parsed.hasTitleSlot;
    hasBodySlot = parsed.hasBodySlot;
    titleSlot = parsed.titleSlot;
    bodySlot = parsed.bodySlot;
  }

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
