import type { CSSProperties } from "react";
import styles from "./SkeletonLoader.module.css";

type SkeletonVariant = "text" | "circle" | "rectangle";

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

export function SkeletonLoader({
  variant = "text",
  width,
  height,
}: SkeletonLoaderProps) {
  const style: CSSProperties = {};

  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]}`}
      style={style}
      aria-hidden="true"
    />
  );
}
