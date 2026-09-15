/**
 * Synapse Skeleton Loader — standalone (no IDS counterpart).
 * Source: components/synapse/skeletonloader/design-spec.md
 */
import React, { type CSSProperties } from "react";
import { cx } from "../../shared/utils/cx";
import styles from "./SynapseSkeletonLoader.module.css";

type SynapseSkeletonShapeVariant = "text" | "heading" | "avatar" | "image" | "button";

export type SynapseSkeletonVariant =
  | SynapseSkeletonShapeVariant
  | "circle"
  | "rectangle"
  | "card"
  | "list"
  | "table"
  | "form";

export interface SynapseSkeletonLoaderProps {
  variant?: SynapseSkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  rows?: number;
  columns?: number;
  label?: string;
  className?: string;
}

function normalizeSize(value?: string | number): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

const shapeVariantClass: Record<SynapseSkeletonShapeVariant, string> = {
  text: styles.SynapseSkeletonLoaderText,
  heading: styles.SynapseSkeletonLoaderHeading,
  avatar: styles.SynapseSkeletonLoaderAvatar,
  image: styles.SynapseSkeletonLoaderImage,
  button: styles.SynapseSkeletonLoaderButton,
};

function SkeletonShape({
  variant,
  width,
  height,
  className,
  style,
}: {
  variant: SynapseSkeletonShapeVariant;
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

  return (
    <div
      className={cx(
        styles.SynapseSkeletonLoaderBone,
        shapeVariantClass[variant],
        className,
      )}
      data-ids="SynapseSkeletonLoaderBone"
      style={sizeStyle}
      aria-hidden="true"
    />
  );
}

export function SynapseSkeletonLoader({
  variant = "text",
  width,
  height,
  lines = 3,
  rows = 3,
  columns = 3,
  label = "Loading...",
  className,
}: SynapseSkeletonLoaderProps) {
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
          className={cx(styles.SynapseSkeletonLoaderCard, className)}
          data-ids="SynapseSkeletonLoader"
          data-variant="card"
          role="status"
          aria-busy="true"
          aria-label={label}
          style={commonStyle}
        >
          <div className={styles.SynapseSkeletonLoaderCardHeader}>
            <SkeletonShape variant="avatar" />
            <div className={styles.SynapseSkeletonLoaderCardMeta}>
              <SkeletonShape variant="heading" width="80%" />
              <SkeletonShape variant="text" width="50%" />
            </div>
          </div>
          <SkeletonShape variant="image" />
          <div className={styles.SynapseSkeletonLoaderCardBody}>
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
          className={cx(styles.SynapseSkeletonLoaderList, className)}
          data-ids="SynapseSkeletonLoader"
          data-variant="list"
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
          className={cx(styles.SynapseSkeletonLoaderTable, className)}
          data-ids="SynapseSkeletonLoader"
          data-variant="table"
          role="status"
          aria-busy="true"
          aria-label={label}
          style={commonStyle}
        >
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className={styles.SynapseSkeletonLoaderTableRow}
              style={tableRowStyle}
            >
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
          className={cx(styles.SynapseSkeletonLoaderForm, className)}
          data-ids="SynapseSkeletonLoader"
          data-variant="form"
          role="status"
          aria-busy="true"
          aria-label={label}
          style={commonStyle}
        >
          <div className={styles.SynapseSkeletonLoaderFormRow}>
            <SkeletonShape variant="text" width={120} />
            <SkeletonShape variant="text" height={40} />
          </div>
          <div className={styles.SynapseSkeletonLoaderFormRow}>
            <SkeletonShape variant="text" width={120} />
            <SkeletonShape variant="text" height={40} />
          </div>
          <SkeletonShape variant="button" />
        </div>
      );
    case "circle":
      return <SkeletonShape variant="avatar" width={width} height={height} className={className} />;
    case "rectangle":
      return <SkeletonShape variant="image" width={width} height={height} className={className} />;
    case "heading":
    case "avatar":
    case "image":
    case "button":
    case "text":
    default:
      return (
        <SkeletonShape
          variant={
            variant === "heading" ||
            variant === "avatar" ||
            variant === "image" ||
            variant === "button"
              ? variant
              : "text"
          }
          width={width}
          height={height}
          className={className}
        />
      );
  }
}

SynapseSkeletonLoader.displayName = "SynapseSkeletonLoader";
