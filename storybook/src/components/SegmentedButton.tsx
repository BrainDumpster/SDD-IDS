import * as React from "react";
import type { ReactNode } from "react";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import { Toggle } from "@base-ui-components/react/toggle";
import { Icon } from "./Icon";
import styles from "./SegmentedButton.module.css";

export type SegmentedIconSource = string | ReactNode;

export interface SegmentedButtonItemText {
  value: string;
  label: string;
  disabled?: boolean;
  /** Storybook / visual QA only — pins hover, press, or focus-visible styling. */
  simulatedState?: "hover" | "press" | "focus-visible";
}

export interface SegmentedButtonItemIcon {
  value: string;
  /** Icon file slug → `assets/icons/<slug>.svg`, or custom UI (SVG/component). */
  icon: SegmentedIconSource;
  ariaLabel: string;
  disabled?: boolean;
  /** Storybook / visual QA only — pins hover, press, or focus-visible styling. */
  simulatedState?: "hover" | "press" | "focus-visible";
}

/** Second argument to `onChange` — stable id plus human-facing name for the segment. */
export type SegmentedButtonChangeMeta =
  | { type: "text"; label: string }
  | { type: "icon"; ariaLabel: string };

type SegmentedButtonPropsBase = {
  value?: string;
  defaultValue?: string;
  /**
   * Called after selection changes. First arg is always `items[].value`.
   * Second arg carries display metadata (`label` or `ariaLabel`) for logging, analytics, or routing.
   * Passing `setState` from `useState` still works — extra args are ignored.
   */
  onChange?: (value: string, meta: SegmentedButtonChangeMeta) => void;
  disabled?: boolean;
  /** Accessible name for the group */
  ariaLabel?: string;
  ariaLabelledby?: string;
};

export type SegmentedButtonProps =
  | (SegmentedButtonPropsBase & {
      type: "text";
      items: SegmentedButtonItemText[];
    })
  | (SegmentedButtonPropsBase & {
      type: "icon";
      items: SegmentedButtonItemIcon[];
      /** Reserved for apps that remap slug root; Storybook uses Vite `assets/icons` glob. */
      iconsBasePath?: string;
    });

function SegmentIcon({ icon }: { icon: SegmentedIconSource }) {
  if (typeof icon !== "string") {
    return <span className={styles.customIcon}>{icon}</span>;
  }

  return (
    <Icon
      shapeName={icon}
      className={styles.segmentIconGlyph}
      style={{ width: 16, height: 14 }}
    />
  );
}

function useSegmentSelection(
  items: readonly (SegmentedButtonItemText | SegmentedButtonItemIcon)[],
  controlledValue: string | undefined,
  defaultValue: string | undefined,
  onChange: SegmentedButtonPropsBase["onChange"],
  type: "text" | "icon",
) {
  const [uncontrolled, setUncontrolled] = React.useState(
    () => defaultValue ?? items[0]?.value ?? "",
  );
  const isControlled = controlledValue !== undefined;
  const selected = isControlled ? controlledValue! : uncontrolled;

  const setSelected = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    if (!onChange) return;
    const item = items.find((i) => i.value === next);
    if (!item) return;
    if (type === "text") {
      const t = item as SegmentedButtonItemText;
      onChange(next, { type: "text", label: t.label });
    } else {
      const ic = item as SegmentedButtonItemIcon;
      onChange(next, { type: "icon", ariaLabel: ic.ariaLabel });
    }
  };

  return { setSelected, groupValue: selected ? [selected] : [] };
}

export function SegmentedButton(props: SegmentedButtonProps) {
  const {
    value: controlledValue,
    defaultValue,
    onChange,
    disabled: groupDisabled = false,
    ariaLabel,
    ariaLabelledby,
  } = props;

  const { setSelected, groupValue } = useSegmentSelection(
    props.items,
    controlledValue,
    defaultValue,
    onChange,
    props.type,
  );

  const groupProps = {
    className: styles.root,
    "data-type": props.type,
    value: groupValue,
    multiple: false as const,
    disabled: groupDisabled,
    onValueChange: (next: string[]) => {
      if (next.length > 0) setSelected(String(next[next.length - 1]));
    },
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
  };

  if (props.type === "text") {
    return (
      <ToggleGroup {...groupProps}>
        {props.items.map((item) => (
          <Toggle
            key={item.value}
            value={item.value}
            disabled={groupDisabled || item.disabled}
            data-simulated-state={item.simulatedState}
            className={(state) =>
              [
                styles.segment,
                styles.segmentText,
                state.pressed ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            {item.label}
          </Toggle>
        ))}
      </ToggleGroup>
    );
  }

  return (
    <ToggleGroup {...groupProps}>
      {props.items.map((item) => (
        <Toggle
          key={item.value}
          value={item.value}
          disabled={groupDisabled || item.disabled}
          aria-label={item.ariaLabel}
          data-simulated-state={item.simulatedState}
          className={(state) =>
            [
              styles.segment,
              styles.segmentIcon,
              state.pressed ? styles.selected : "",
            ]
              .filter(Boolean)
              .join(" ")
          }
        >
          <SegmentIcon icon={item.icon} />
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
