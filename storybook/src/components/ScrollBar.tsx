import { ScrollArea } from "@base-ui-components/react/scroll-area";
import type { ReactNode } from "react";
import styles from "./ScrollBar.module.css";

interface ScrollBarProps {
  children: ReactNode;
  height: number | string;
}

export function ScrollBar({ children, height }: ScrollBarProps) {
  return (
    <ScrollArea.Root
      className={styles.root}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <ScrollArea.Viewport className={styles.viewport}>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={styles.scrollbar} orientation="vertical">
        <ScrollArea.Thumb className={styles.thumb} />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
