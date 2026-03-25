import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  elevated?: boolean;
  outlined?: boolean;
}

export function Card({
  title,
  children,
  footer,
  elevated = false,
  outlined = false,
}: CardProps) {
  const classNames = [
    styles.card,
    elevated ? styles.elevated : "",
    outlined ? styles.outlined : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
