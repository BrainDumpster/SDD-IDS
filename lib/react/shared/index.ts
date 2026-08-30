/**
 * Lib-shared React utilities & primitives for IDS components.
 * Prefer these over third-party headless UI packages in `lib/react/ids/*`.
 */

export { Menu } from "./menu";
export type {
  MenuRootProps,
  MenuTriggerProps,
  MenuPortalProps,
  MenuPositionerProps,
  MenuPopupProps,
  MenuItemProps,
  MenuSubmenuRootProps,
  MenuSubmenuTriggerProps,
} from "./menu";

export { ScrollArea } from "./scroll-area";
export type {
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
} from "./scroll-area";

export { cx } from "./utils/cx";
export { mergeRefs } from "./utils/mergeRefs";
export { useControllableState } from "./utils/useControllableState";
export {
  useAnchorPosition,
  type AnchorSide,
  type AnchorAlign,
  type CollisionAvoidance,
  type AnchorPositionOptions,
  type AnchorPositionResult,
} from "./utils/useAnchorPosition";
