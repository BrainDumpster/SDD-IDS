import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/powerflex-theme.css";

export interface TextBoxProps {
  size?: "sm" | "md" | "lg";
  state?: "default" | "hover" | "active" | "disabled" | "error";
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  helperText?: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  size = "md",
  state = "default",
  value = "",
  placeholder = "Placeholder",
  disabled = false,
  invalid = false,
  helperText,
}) => {
  const sizeHeight = {
    sm: "24px",
    md: "32px",
    lg: "40px",
  }[size];

  const borderColor =
    {
      default: "var(--input-border-color, #888888)",
      hover: "var(--input-hover-border-color, #333333)",
      active: "var(--input-active-border-color, #0076ce)",
      disabled: "var(--input-disabled-border-color, #888888)",
      error: "var(--input-error-border-color, #af0000)",
    }[state];

  const backgroundColor =
    state === "disabled"
      ? "var(--input-disabled-background-color, #f4f4f4)"
      : "var(--input-background-color, #ffffff)";

  const color =
    state === "disabled"
      ? "var(--input-disabled-text-color, #777777)"
      : "var(--input-text-color, #333333)";

  const showPlaceholder = !value && (state === "default" || state === "hover" || state === "active" || state === "error");

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: "4px" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: sizeHeight,
          padding: "0 8px",
          border: `1px solid ${borderColor}`,
          borderRadius: "var(--input-border-radius, 5px)",
          backgroundColor,
          color,
          fontSize: "var(--input-font-size, 14px)",
          lineHeight: "var(--input-line-height, 20px)",
          fontFamily: "Roboto, sans-serif",
          outline: state === "active" ? "1px solid var(--input-focus-ring-color, #0076ce)" : "none",
          outlineOffset: "1px",
        }}
      >
        <span style={{ opacity: showPlaceholder ? 1 : 0, position: showPlaceholder ? "static" : "absolute" }}>
          {showPlaceholder ? placeholder : value}
        </span>
      </div>
      {invalid && helperText && (
        <span style={{ color: "var(--input-error-text-color, #af0000)", fontSize: "14px", lineHeight: "20px" }}>
          {helperText}
        </span>
      )}
    </div>
  );
};

const meta: Meta<typeof TextBox> = {
  title: "Spec Generated/Powerflex/Text Box",
  component: TextBox,
  tags: ["autodocs"],
  args: {
    size: "md",
    state: "default",
    value: "",
    placeholder: "Placeholder",
    disabled: false,
    invalid: false,
    helperText: "",
  },
};

export default meta;
type Story = StoryObj<typeof TextBox>;

export const Default: Story = {
  args: {},
};

export const Hover: Story = {
  args: {
    state: "hover",
  },
};

export const Active: Story = {
  args: {
    state: "active",
    value: "Typed value",
  },
};

export const Disabled: Story = {
  args: {
    state: "disabled",
    value: "Disabled value",
  },
};

export const Error: Story = {
  args: {
    state: "error",
    invalid: true,
    helperText: "Error message",
  },
};
