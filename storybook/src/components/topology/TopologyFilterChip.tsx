import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Icon } from "../Icon";
import styles from "./TopologyFilterChip.module.css";

export interface TopologyFilterChipProps extends ComponentPropsWithoutRef<"span"> {
  fieldName?: string;
  value: string;
}

/** Figma `54015:299554` — topology status filter pill (Label: Value + caret). */
export const TopologyFilterChip = forwardRef<HTMLSpanElement, TopologyFilterChipProps>(
  function TopologyFilterChip({ fieldName = "Status", value, className, ...rest }, ref) {
    return (
      <span ref={ref} className={[styles.chip, className].filter(Boolean).join(" ")} {...rest}>
        <span className={styles.content}>
          <span className={styles.fieldName}>{fieldName}</span>
          <span aria-hidden="true">:</span>
          <span>{value}</span>
        </span>
        <Icon
          shapeName="arrow-drop-tri-caret"
          className={styles.caret}
          color="var(--color-icon-accessible)"
        />
      </span>
    );
  },
);
