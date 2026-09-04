import { useState, type ComponentProps } from "react";
import styles from "./AnchorMenu.module.css";

interface AnchorMenuItem {
  label: string;
  href: string;
  active?: boolean;
}

interface AnchorMenuProps extends ComponentProps<"nav"> {
  items: AnchorMenuItem[];
  header?: boolean;
  title?: string;
}

export function AnchorMenu({ items, header = true, title = "On this page", className, ...rest }: AnchorMenuProps) {
  const [activeHref, setActiveHref] = useState<string | undefined>(
    () => items.find((item) => item.active)?.href
  );

  return (
    <nav
      aria-label={title}
      className={[styles.nav, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {header && <span className={styles.heading}>{title}</span>}
      <ul className={styles.list}>
        {items.map((item, index) => {
          const isActive = activeHref !== undefined ? activeHref === item.href : !!item.active;
          return (
            <li key={index} className={styles.item}>
              <a
                href={item.href}
                className={[styles.link, isActive ? styles.active : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  setActiveHref(item.href);
                  if (item.href.startsWith("#")) {
                    e.preventDefault();
                    document
                      .getElementById(item.href.slice(1))
                      ?.scrollIntoView({ behavior: "smooth" });
                    window.history.replaceState(null, "", item.href);
                  }
                }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
