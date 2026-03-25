import type { ComponentProps } from "react";
import styles from "./AnchorMenu.module.css";

interface AnchorMenuItem {
  label: string;
  href: string;
  active?: boolean;
}

interface AnchorMenuProps extends ComponentProps<"nav"> {
  items: AnchorMenuItem[];
}

export function AnchorMenu({ items, className, ...rest }: AnchorMenuProps) {
  return (
    <nav
      aria-label="On this page"
      className={[styles.nav, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span className={styles.heading}>On this page</span>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            <a
              href={item.href}
              className={[styles.link, item.active ? styles.active : ""]
                .filter(Boolean)
                .join(" ")}
              aria-current={item.active ? "true" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
