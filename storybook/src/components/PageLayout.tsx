import type { ReactNode } from "react";
import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  masthead?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ masthead, sidebar, children }: PageLayoutProps) {
  return (
    <div
      className={[
        styles.root,
        masthead ? styles.hasMasthead : "",
        sidebar ? styles.hasSidebar : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {masthead && <header className={styles.masthead}>{masthead}</header>}
      {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
