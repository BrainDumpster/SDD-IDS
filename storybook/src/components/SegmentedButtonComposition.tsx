import * as React from "react";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import { Toggle } from "@base-ui-components/react/toggle";
import { Icon } from "./Icon";
import styles from "./SegmentedButton.module.css";
import type { SegmentedButtonChangeMeta } from "./SegmentedButton";

export type SegmentedButtonSimulatedState = "hover" | "press" | "focus-visible";

type SegmentedButtonsType = "text" | "icon";

type SegmentedButtonsContextValue = {
  type: SegmentedButtonsType;
  groupDisabled: boolean;
  registerMeta: (value: string, meta: SegmentedButtonChangeMeta) => void;
  unregisterMeta: (value: string) => void;
};

const SegmentedButtonsContext = React.createContext<SegmentedButtonsContextValue | null>(
  null,
);

function useSegmentedButtonsContext(component: string): SegmentedButtonsContextValue {
  const ctx = React.useContext(SegmentedButtonsContext);
  if (!ctx) {
    throw new Error(`${component} must be used inside SegmentedButtons.`);
  }
  return ctx;
}

function coerceSelected(value: string | number | undefined): string | undefined {
  return value === undefined ? undefined : String(value);
}

export type SegmentedButtonsProps = {
  type: SegmentedButtonsType;
  selected?: string | number;
  defaultSelected?: string | number;
  onSelectedChange?: (value: string) => void;
  onChange?: (value: string, meta: SegmentedButtonChangeMeta) => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  children: React.ReactNode;
};

export function SegmentedButtons({
  type,
  selected: controlledSelected,
  defaultSelected,
  onSelectedChange,
  onChange,
  disabled: groupDisabled = false,
  ariaLabel,
  ariaLabelledby,
  children,
}: SegmentedButtonsProps) {
  const metaByValue = React.useRef(new Map<string, SegmentedButtonChangeMeta>());
  const [uncontrolled, setUncontrolled] = React.useState(
    () => coerceSelected(defaultSelected) ?? "",
  );
  const isControlled = controlledSelected !== undefined;
  const selected = isControlled ? coerceSelected(controlledSelected)! : uncontrolled;

  const setSelected = React.useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onSelectedChange?.(next);
      const meta = metaByValue.current.get(next);
      if (meta) {
        onChange?.(next, meta);
      }
    },
    [isControlled, onChange, onSelectedChange],
  );

  const registerMeta = React.useCallback((value: string, meta: SegmentedButtonChangeMeta) => {
    metaByValue.current.set(value, meta);
  }, []);

  const unregisterMeta = React.useCallback((value: string) => {
    metaByValue.current.delete(value);
  }, []);

  const contextValue = React.useMemo(
    () => ({ type, groupDisabled, registerMeta, unregisterMeta }),
    [type, groupDisabled, registerMeta, unregisterMeta],
  );

  return (
    <SegmentedButtonsContext.Provider value={contextValue}>
      <ToggleGroup
        className={styles.root}
        data-type={type}
        value={selected ? [selected] : []}
        multiple={false}
        disabled={groupDisabled}
        onValueChange={(next: string[]) => {
          if (next.length > 0) {
            setSelected(String(next[next.length - 1]));
          }
        }}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        {children}
      </ToggleGroup>
    </SegmentedButtonsContext.Provider>
  );
}

export type SegmentedTextProps = {
  value: string | number;
  label: string;
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
  simulatedState?: SegmentedButtonSimulatedState;
};

export function SegmentedText({
  value,
  label,
  ariaLabel,
  title,
  disabled = false,
  simulatedState,
}: SegmentedTextProps) {
  const { type, groupDisabled, registerMeta, unregisterMeta } =
    useSegmentedButtonsContext("SegmentedText");
  const segmentValue = String(value);

  React.useEffect(() => {
    if (type !== "text") {
      console.error("SegmentedText must be used when SegmentedButtons type is text.");
    }
    registerMeta(segmentValue, { type: "text", label });
    return () => unregisterMeta(segmentValue);
  }, [type, label, registerMeta, segmentValue, unregisterMeta]);

  return (
    <Toggle
      value={segmentValue}
      disabled={groupDisabled || disabled}
      aria-label={ariaLabel ?? label}
      title={title}
      data-simulated-state={simulatedState}
      className={(state) =>
        [styles.segment, styles.segmentText, state.pressed ? styles.selected : ""]
          .filter(Boolean)
          .join(" ")
      }
    >
      {label}
    </Toggle>
  );
}

export type SegmentedIconProps = {
  value: string | number;
  shape: string;
  ariaLabel: string;
  title?: string;
  color?: string;
  disabled?: boolean;
  simulatedState?: SegmentedButtonSimulatedState;
};

export function SegmentedIcon({
  value,
  shape,
  ariaLabel,
  title,
  color,
  disabled = false,
  simulatedState,
}: SegmentedIconProps) {
  const { type, groupDisabled, registerMeta, unregisterMeta } =
    useSegmentedButtonsContext("SegmentedIcon");
  const segmentValue = String(value);

  React.useEffect(() => {
    if (type !== "icon") {
      console.error("SegmentedIcon must be used when SegmentedButtons type is icon.");
    }
    registerMeta(segmentValue, { type: "icon", ariaLabel });
    return () => unregisterMeta(segmentValue);
  }, [ariaLabel, registerMeta, segmentValue, type, unregisterMeta]);

  return (
    <Toggle
      value={segmentValue}
      disabled={groupDisabled || disabled}
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      data-simulated-state={simulatedState}
      className={(state) =>
        [styles.segment, styles.segmentIcon, state.pressed ? styles.selected : ""]
          .filter(Boolean)
          .join(" ")
      }
      style={color ? { color } : undefined}
    >
      <Icon
        shapeName={shape}
        color={color}
        className={styles.segmentIconGlyph}
        style={{ width: 16, height: 14 }}
      />
    </Toggle>
  );
}
