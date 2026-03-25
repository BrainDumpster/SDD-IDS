import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import type { ReactNode } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger className={styles.trigger} render={<span />}>
          {children}
        </BaseTooltip.Trigger>
        <BaseTooltip.Positioner side={side} sideOffset={8}>
          <BaseTooltip.Popup className={styles.popup}>
            <BaseTooltip.Arrow className={styles.arrow} />
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}
