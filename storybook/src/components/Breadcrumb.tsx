import { Separator } from "@base-ui-components/react/separator";
import type { ComponentProps } from "react";
import styles from "./Breadcrumb.module.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends ComponentProps<"nav"> {
  items: BreadcrumbItem[];
  separator?: "/" | ">";
}

export function Breadcrumb({
  items,
  separator = "/",
  className,
  ...rest
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={[styles.nav, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className={styles.item}>
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <a href={item.href ?? "#"} className={styles.link}>
                    {item.label}
                  </a>
                  <Separator className={styles.separator} aria-hidden="true">
                    {separator}
                  </Separator>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
