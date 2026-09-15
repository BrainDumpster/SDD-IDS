/**
 * Synapse Left Nav — thin wrapper over IDS Main Menu/Left.
 *
 * Strategy: wrapper + overlay-css.
 * IDS implementation: `lib/react/ids/main-menu-left` (no Synapse knowledge).
 * Overlay: `SynapseLeftNav.module.css` (rail width, right-only border, gradient).
 *
 * New Chat (`menuLead`) is not on IdsMainMenuLeft yet — do not fake it here.
 * When IDS grows a lead slot, wire it in this wrapper only.
 */
import type { IdsMainMenuLeftProps } from "../../ids/main-menu-left";
import { IdsMainMenuLeft } from "../../ids/main-menu-left";
import { cx } from "../../shared/utils/cx";
import { useControllableState } from "../../shared/utils/useControllableState";
import styles from "./SynapseLeftNav.module.css";

export type SynapseLeftNavProps = IdsMainMenuLeftProps;

export function SynapseLeftNav({
  ariaLabel = "Left navigation",
  expanded,
  onExpandedChange,
  className,
  ...rest
}: SynapseLeftNavProps) {
  const [isExpanded, setExpanded] = useControllableState({
    value: expanded,
    defaultValue: true,
    onChange: onExpandedChange,
  });

  return (
    <IdsMainMenuLeft
      ariaLabel={ariaLabel}
      expanded={isExpanded}
      onExpandedChange={setExpanded}
      className={cx(
        styles.SynapseLeftNav,
        isExpanded ? styles.SynapseLeftNavExpanded : styles.SynapseLeftNavCollapsed,
        className,
      )}
      {...rest}
    />
  );
}

export default SynapseLeftNav;
