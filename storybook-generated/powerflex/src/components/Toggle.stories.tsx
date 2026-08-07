import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/powerflex-theme.css";

type ToggleProps = {
  size?: "sm" | "md" | "lg";
  checked?: boolean;
  disabled?: boolean;
  state?: "default" | "hover" | "active" | "disabled";
  "aria-label"?: string;
  onChange?: (checked: boolean) => void;
};

const sizeMap = {
  sm: { trackW: 32, trackH: 16, thumb: 12, focusW: 38, focusH: 22 },
  md: { trackW: 44, trackH: 24, thumb: 20, focusW: 50, focusH: 30 },
  lg: { trackW: 52, trackH: 28, thumb: 24, focusW: 58, focusH: 34 },
};

const stateBg = {
  on: {
    default: "var(--color-background-controls-brand-base)",
    hover: "var(--color-background-controls-brand-strong)",
    active: "var(--color-background-controls-brand-stronger)",
    disabled: "var(--color-background-gray-lighter)",
  },
  off: {
    default: "var(--color-background-gray-light)",
    hover: "var(--color-background-gray-base)",
    active: "var(--color-background-gray-strong)",
    disabled: "var(--color-background-gray-lighter)",
  },
};

const Toggle = ({
  size = "md",
  checked: checkedProp = false,
  disabled = false,
  state = "default",
  "aria-label": ariaLabel = "Toggle",
  onChange,
}: ToggleProps) => {
  const [isChecked, setIsChecked] = useState(checkedProp);

  useEffect(() => {
    setIsChecked(checkedProp);
  }, [checkedProp]);

  const s = sizeMap[size] ?? sizeMap.md;
  const variant = isChecked ? "on" : "off";
  const isDisabled = disabled || state === "disabled";
  const visualState = isDisabled ? "disabled" : state;
  const trackBg = stateBg[variant][visualState];
  const thumbTranslate = isChecked ? s.trackW - s.thumb - 4 : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    setIsChecked(next);
    onChange?.(next);
  };

  return (
    <label
      className={`toggle toggle--${size} toggle--${isChecked ? "on" : "off"} toggle--${isDisabled ? "disabled" : "enabled"}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: s.trackW,
        height: s.trackH,
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      <input
        type="checkbox"
        role="switch"
        checked={isChecked}
        disabled={isDisabled}
        aria-checked={isChecked ? "true" : "false"}
        aria-disabled={isDisabled ? "true" : undefined}
        aria-label={ariaLabel}
        onChange={handleChange}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          margin: 0,
          cursor: "inherit",
          zIndex: 2,
        }}
      />
      <span
        className="toggle__track"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: s.trackW,
          height: s.trackH,
          borderRadius: "var(--toggle-control-radius, 9999px)",
          backgroundColor: trackBg,
          zIndex: 0,
        }}
      />
      <span
        className="toggle__thumb"
        style={{
          width: s.thumb,
          height: s.thumb,
          borderRadius: "var(--toggle-control-radius, 9999px)",
          backgroundColor: "var(--toggle-thumb-fill, #ffffff)",
          position: "absolute",
          top: 2,
          left: 2,
          transform: `translateX(${thumbTranslate}px)`,
          transition: "transform 150ms ease",
          zIndex: 1,
        }}
      />
      <span
        className="toggle__focus-ring"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: (s.trackW - s.focusW) / 2,
          top: (s.trackH - s.focusH) / 2,
          width: s.focusW,
          height: s.focusH,
          borderRadius: "var(--toggle-control-radius, 9999px)",
          border: "1px solid var(--color-border-brand-base)",
          boxSizing: "border-box",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </label>
  );
};

const meta: Meta<typeof Toggle> = {
  title: "Spec Generated/Powerflex/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    state: { control: "select", options: ["default", "hover", "active", "disabled"] },
  },
  args: { size: "md", checked: false, disabled: false, state: "default" },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Playground: Story = {
  args: { size: "md", checked: false, disabled: false, state: "default" },
};

export const AllStates: Story = {
  render: () => {
    const sizes: Array<"sm" | "md" | "lg"> = ["sm", "md", "lg"];
    const states: Array<"default" | "hover" | "active" | "disabled"> = ["default", "hover", "active", "disabled"];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <strong style={{ fontFamily: "sans-serif", textTransform: "uppercase", fontSize: 12 }}>{size}</strong>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {states.map((state) => (
                <div key={state} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <Toggle size={size} checked={false} state={state} aria-label={`${size} off ${state}`} />
                  <span style={{ fontSize: 10 }}>off {state}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {states.map((state) => (
                <div key={state} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <Toggle size={size} checked state={state} aria-label={`${size} on ${state}`} />
                  <span style={{ fontSize: 10 }}>on {state}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
