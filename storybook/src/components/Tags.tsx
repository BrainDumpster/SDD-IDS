import React from "react";
import type { ReactNode } from "react";

const tagsGroupStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--spacing-space-8)",
  alignItems: "center",
};

const tagsGroupNowrapStyle: React.CSSProperties = {
  ...tagsGroupStyle,
  flexWrap: "nowrap",
};

export function Tags({
  wrap = true,
  ariaLabel,
  children,
}: {
  wrap?: boolean;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <div role="group" aria-label={ariaLabel} style={wrap ? tagsGroupStyle : tagsGroupNowrapStyle}>
      {children}
    </div>
  );
}
