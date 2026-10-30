import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Icon } from "./Icon";

export type SplitButtonChildren = {
  leadingIcon: ReactNode | null;
  label: ReactNode;
};

function isLeadingIconElement(child: ReactNode): child is ReactElement {
  return isValidElement(child) && child.type === Icon;
}

/** Split optional leading `Icon` child from label content (composition API). */
export function splitButtonChildren(children: ReactNode): SplitButtonChildren {
  const items = Children.toArray(children);
  if (items.length === 0) {
    return { leadingIcon: null, label: null };
  }

  const [first, ...rest] = items;
  if (isLeadingIconElement(first)) {
    return {
      leadingIcon: first,
      label: rest.length > 0 ? rest : null,
    };
  }

  return { leadingIcon: null, label: children };
}
