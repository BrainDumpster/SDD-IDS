import type { ComponentPropsWithoutRef } from "react";
import { Icon } from "../Icon";
import styles from "./TopologyAddFilterButton.module.css";

export interface TopologyAddFilterButtonProps extends ComponentPropsWithoutRef<"button"> {}

/** Figma `54197:38669` — Add Filter CTA (`state-add-circ-solid` + brand-strong label). */
export function TopologyAddFilterButton({ className, type = "button", ...rest }: TopologyAddFilterButtonProps) {
  return (
    <button type={type} className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <Icon shapeName="state-add-circ-solid" className={styles.icon} variant="img" />
      <span>Add Filter</span>
    </button>
  );
}
