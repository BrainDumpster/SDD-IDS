import type { ReactNode } from "react";

export interface TopologyStoryCodePanelProps {
  title?: string;
  code: string;
  children?: ReactNode;
}

/** Renders copy-paste developer usage on the Canvas (no Docs tab required). */
export function TopologyStoryCodePanel({
  title = "Developer usage",
  code,
  children,
}: TopologyStoryCodePanelProps) {
  return (
    <div
      data-design-system="synapse"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--color-background-surface-1)",
      }}
    >
      {children}
      <section
        style={{
          flexShrink: 0,
          padding: "var(--padding-padding-16) var(--padding-padding-24)",
          borderTop: "var(--border-width-border-default) solid var(--color-border-light)",
          background: "var(--color-background-surface-2)",
        }}
      >
        <h2
          style={{
            margin: "0 0 var(--spacing-space-8)",
            fontSize: "var(--font-size-body-2)",
            lineHeight: "var(--font-line-height-line-height-20)",
            fontWeight: 600,
            color: "var(--color-text-neutral-strong)",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: "0 0 var(--spacing-space-12)",
            fontSize: "var(--font-size-body-3, 12px)",
            lineHeight: "18px",
            color: "var(--color-text-neutral)",
          }}
        >
          Copy into your app. Load <code>components/synapse-theme.css</code> and set{" "}
          <code>data-design-system=&quot;synapse&quot;</code> on a root element.
        </p>
        <pre
          style={{
            margin: 0,
            padding: "var(--padding-padding-16)",
            overflow: "auto",
            fontSize: 12,
            lineHeight: 1.5,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            background: "var(--color-background-component)",
            color: "var(--color-text-neutral-strong)",
            border: "var(--border-width-border-default) solid var(--color-border-accessible)",
            borderRadius: "var(--corner-radius-radius-4)",
            maxHeight: 420,
          }}
        >
          <code>{code}</code>
        </pre>
      </section>
    </div>
  );
}
