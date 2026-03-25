import type { ComponentProps, ReactNode } from "react";
import styles from "./Masthead.module.css";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface MastheadProps extends ComponentProps<"header"> {
  logo?: ReactNode;
  navItems?: NavItem[];
  actions?: ReactNode;
}

export function Masthead({
  logo,
  navItems = [],
  actions,
  className,
  ...rest
}: MastheadProps) {
  return (
    <header
      className={[styles.masthead, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <div className={styles.left}>
        {logo && <div className={styles.logo}>{logo}</div>}
        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {navItems.map((item, index) => (
              <li key={index} className={styles.navItem}>
                <a
                  href={item.href}
                  className={[
                    styles.navLink,
                    item.active ? styles.navLinkActive : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
