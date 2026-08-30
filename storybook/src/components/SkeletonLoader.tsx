import type { CSSProperties } from "react";
import styles from "./SkeletonLoader.module.css";

type SkeletonShapeVariant = "text" | "heading" | "avatar" | "image" | "button";

export type SkeletonVariant =
  | SkeletonShapeVariant
  | "circle" // alias for avatar
  | "rectangle" // alias for image
  | "card"
  | "list"
  | "table"
  | "form";

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  rows?: number;
  columns?: number;
  label?: string;
}

function normalizeSize(value?: string | number): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

const shapeVariantClass: Record<SkeletonShapeVariant, string> = {
  text: styles.text,
  heading: styles.heading,
  avatar: styles.avatar,
  image: styles.image,
  button: styles.button,
};

function SkeletonShape({
  variant,
  width,
  height,
  className,
  style,
}: {
  variant: SkeletonShapeVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
}) {
  const sizeStyle: CSSProperties = { ...style };
  const normalizedWidth = normalizeSize(width);
  const normalizedHeight = normalizeSize(height);
  if (normalizedWidth) sizeStyle.width = normalizedWidth;
  if (normalizedHeight) sizeStyle.height = normalizedHeight;

  const classes = [styles.skeleton, shapeVariantClass[variant], className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes} style={sizeStyle} aria-hidden="true" />;
}

export function SkeletonLoader({
  variant = "text",
  width,
  height,
  lines = 3,
  rows = 3,
  columns = 3,
  label = "Loading...",
}: SkeletonLoaderProps) {
  const commonStyle: CSSProperties = {};
  const normalizedWidth = normalizeSize(width);
  const normalizedHeight = normalizeSize(height);
  if (normalizedWidth) commonStyle.width = normalizedWidth;
  if (normalizedHeight) commonStyle.height = normalizedHeight;

  const tableRowStyle = {
    ["--skeleton-table-columns"]: String(columns),
  } as CSSProperties;

  switch (variant) {
    case "card":
      return (
        <div
          className={styles.card}
          role="status"
          aria-busy="true"
          aria-label={label}
          style={commonStyle}
        >
          <div className={styles.cardHeader}>
            <SkeletonShape variant="avatar" />
            <div className={styles.cardMeta}>
              <SkeletonShape variant="heading" width="80%" />
              <SkeletonShape variant="text" width="50%" />
            </div>
          </div>
          <SkeletonShape variant="image" />
          <div className={styles.cardBody}>
            {Array.from({ length: lines }).map((_, index) => (
              <SkeletonShape
                key={index}
                variant="text"
                width={index === lines - 1 ? "70%" : "100%"}
              />
            ))}
          </div>
        </div>
      );
    case "list":
      return (
        <div
          className={styles.list}
          role="status"
          aria-busy="true"
          aria-label={label}
          style={commonStyle}
        >
          {Array.from({ length: lines }).map((_, index) => (
            <SkeletonShape key={index} variant="text" />
          ))}
        </div>
      );
    case "table":
      return (
        <div
          className={styles.table}
          role="status"
          aria-busy="true"
          aria-label={label}
          style={commonStyle}
        >
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className={styles.tableRow} style={tableRowStyle}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <SkeletonShape key={colIndex} variant="text" />
              ))}
            </div>
          ))}
        </div>
      );
    case "form":
      return (
        <div
          className={styles.form}
          role="status"
          aria-busy="true"
          aria-label={label}
          style={commonStyle}
        >
          <div className={styles.formRow}>
            <SkeletonShape variant="text" width={120} />
            <SkeletonShape variant="text" height={40} />
          </div>
          <div className={styles.formRow}>
            <SkeletonShape variant="text" width={120} />
            <SkeletonShape variant="text" height={40} />
          </div>
          <SkeletonShape variant="button" />
        </div>
      );
    case "circle":
      return <SkeletonShape variant="avatar" width={width} height={height} />;
    case "rectangle":
      return <SkeletonShape variant="image" width={width} height={height} />;
    case "heading":
    case "avatar":
    case "image":
    case "button":
    case "text":
    default:
      return <SkeletonShape variant={variant} width={width} height={height} />;
  }
}
