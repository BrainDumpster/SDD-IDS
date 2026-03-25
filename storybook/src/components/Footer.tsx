import type { ComponentProps } from "react";
import styles from "./Footer.module.css";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps extends ComponentProps<"footer"> {
  links?: FooterLink[][];
  copyright?: string;
}

export function Footer({ links = [], copyright, className, ...rest }: FooterProps) {
  return (
    <footer
      className={[styles.footer, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {links.length > 0 && (
        <div className={styles.columns}>
          {links.map((column, ci) => (
            <ul key={ci} className={styles.column}>
              {column.map((link, li) => (
                <li key={li} className={styles.item}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      )}
      {copyright && (
        <div className={styles.copyright}>
          <span>{copyright}</span>
        </div>
      )}
    </footer>
  );
}
