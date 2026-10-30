/**
 * IDS Segmented Button — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/segmented-button`
 * Source: `components/ids/segmented-button/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Hierarchy (compound — no items[]):
 *   IdsSegmentedButton
 *     IdsSegmentedText[]   (type="text", 2–5)
 *     IdsSegmentedIcon[]   (type="icon", 2–3)
 *
 * Selection: single-select radiogroup. Disabled is out of scope (not in Figma).
 * Icon slugs resolve via shared `IdsIcon` (`shape`). No @base-ui-components.
 */

import React, {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsSegmentedButton.module.css";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type IdsSegmentedIconSource = ReactNode;

/** Storybook / visual QA only — pins hover, press, or focus-visible styling. */
export type IdsSegmentedSimulatedState = "hover" | "press" | "focus-visible";

/** Second argument to `onSelected` / `onChange`. */
export type IdsSegmentedButtonChangeMeta =
  | { type: "text"; label: string }
  | { type: "icon"; ariaLabel: string };

export interface IdsSegmentedTextProps {
  value: string;
  label: string;
  selected?: boolean;
  title?: string;
  ariaLabel?: string;
  /** Storybook / QA only. */
  simulatedState?: IdsSegmentedSimulatedState;
}

export interface IdsSegmentedIconProps {
  value: string;
  /** Icon slug → `assets/icons/<shape>.svg`. */
  shape?: string;
  /** Custom IconSlot; wins over `shape` when both are set. */
  icon?: IdsSegmentedIconSource;
  selected?: boolean;
  title?: string;
  ariaLabel: string;
  /** Storybook / QA only. */
  simulatedState?: IdsSegmentedSimulatedState;
}

export interface IdsSegmentedButtonProps {
  type: "text" | "icon";
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onSelected?: (value: string, meta: IdsSegmentedButtonChangeMeta) => void;
  /** Alias of `onSelected`. */
  onChange?: (value: string, meta: IdsSegmentedButtonChangeMeta) => void;
  ariaLabel?: string;
  ariaLabelledby?: string;
  /** Reserved for apps that remap slug root; IdsIcon uses Vite `assets/icons` glob. */
  iconsBasePath?: string;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

interface SegmentDescriptor {
  value: string;
  kind: "text" | "icon";
  label?: string;
  ariaLabel?: string;
  title?: string;
  shape?: string;
  icon?: IdsSegmentedIconSource;
  selectedHint?: boolean;
  simulatedState?: IdsSegmentedSimulatedState;
}

const SLUG_PATTERN = /^[a-z0-9-]+$/;

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function warnDev(message: string): void {
  console.error(`[IdsSegmentedButton] ${message}`);
}

function isValidItemCount(type: "text" | "icon", count: number): boolean {
  if (type === "text") return count >= 2 && count <= 5;
  return count >= 2 && count <= 3;
}

function isIdsSegmentedTextElement(
  node: ReactNode,
): node is ReactElement<IdsSegmentedTextProps> {
  return isValidElement(node) && node.type === IdsSegmentedText;
}

function isIdsSegmentedIconElement(
  node: ReactNode,
): node is ReactElement<IdsSegmentedIconProps> {
  return isValidElement(node) && node.type === IdsSegmentedIcon;
}

function collectSegments(
  type: "text" | "icon",
  children: ReactNode,
): SegmentDescriptor[] {
  const out: SegmentDescriptor[] = [];
  Children.forEach(children, (child) => {
    if (child == null || child === false) return;
    if (type === "text") {
      if (!isIdsSegmentedTextElement(child)) {
        warnDev(`type="text" requires IdsSegmentedText children only.`);
        return;
      }
      const p = child.props;
      out.push({
        value: p.value,
        kind: "text",
        label: p.label,
        ariaLabel: p.ariaLabel,
        title: p.title,
        selectedHint: p.selected,
        simulatedState: p.simulatedState,
      });
      return;
    }
    if (!isIdsSegmentedIconElement(child)) {
      warnDev(`type="icon" requires IdsSegmentedIcon children only.`);
      return;
    }
    const p = child.props;
    out.push({
      value: p.value,
      kind: "icon",
      ariaLabel: p.ariaLabel,
      title: p.title,
      shape: p.shape,
      icon: p.icon,
      selectedHint: p.selected,
      simulatedState: p.simulatedState,
    });
  });
  return out;
}

function resolveInitialValue(
  segments: SegmentDescriptor[],
  defaultValue: string | undefined,
): string {
  if (defaultValue != null && defaultValue !== "") return defaultValue;
  const hinted = segments.find((s) => s.selectedHint);
  if (hinted) return hinted.value;
  return segments[0]?.value ?? "";
}

function SegmentGlyph({
  shape,
  icon,
}: {
  shape?: string;
  icon?: IdsSegmentedIconSource;
}): ReactElement {
  if (icon != null) {
    return (
      <span className={styles["ids-segmented-button__custom-icon"]}>{icon}</span>
    );
  }

  if (shape == null || shape === "") {
    warnDev("IdsSegmentedIcon requires `shape` or `icon`.");
    return <span className={styles["ids-segmented-button__icon-glyph"]} aria-hidden />;
  }

  if (!SLUG_PATTERN.test(shape)) {
    warnDev(
      `Invalid shape slug "${shape}" — must match ^[a-z0-9-]+$. Rendering empty icon region.`,
    );
    return <span className={styles["ids-segmented-button__icon-glyph"]} aria-hidden />;
  }

  return (
    <IdsIcon
      shape={shape}
      className={styles["ids-segmented-button__icon-glyph"]}
      style={{ width: 16, height: 14 }}
      size={16}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Children (declaration markers; parent renders surfaces)                    */
/* -------------------------------------------------------------------------- */

/** Text segment child — props collected by `IdsSegmentedButton`. */
export function IdsSegmentedText(_props: IdsSegmentedTextProps): null {
  return null;
}
IdsSegmentedText.displayName = "IdsSegmentedText";

/** Icon segment child — props collected by `IdsSegmentedButton`. */
export function IdsSegmentedIcon(_props: IdsSegmentedIconProps): null {
  return null;
}
IdsSegmentedIcon.displayName = "IdsSegmentedIcon";

/* -------------------------------------------------------------------------- */
/* Parent                                                                     */
/* -------------------------------------------------------------------------- */

export function IdsSegmentedButton(
  props: IdsSegmentedButtonProps,
): ReactElement | null {
  const {
    type,
    children,
    value: controlledValue,
    defaultValue,
    onSelected,
    onChange,
    ariaLabel,
    ariaLabelledby,
    className,
  } = props;

  const notify = onSelected ?? onChange;
  const segmentRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const segments = useMemo(
    () => collectSegments(type, children),
    [type, children],
  );

  const isControlled = controlledValue !== undefined;
  const [uncontrolled, setUncontrolled] = useState(() =>
    resolveInitialValue(collectSegments(type, children), defaultValue),
  );
  const selected = isControlled ? controlledValue! : uncontrolled;

  const setSelected = useCallback(
    (next: string) => {
      if (next === selected) return;
      if (!isControlled) setUncontrolled(next);
      if (!notify) return;
      const seg = segments.find((s) => s.value === next);
      if (!seg) return;
      if (seg.kind === "text") {
        notify(next, { type: "text", label: seg.label ?? "" });
      } else {
        notify(next, { type: "icon", ariaLabel: seg.ariaLabel ?? "" });
      }
    },
    [isControlled, notify, segments, selected],
  );

  const count = segments.length;
  if (!isValidItemCount(type, count)) {
    warnDev(
      type === "text"
        ? `Invalid text option count ${count}; required 2–5. Refusing render.`
        : `Invalid icon option count ${count}; required 2–3. Refusing render.`,
    );
    return null;
  }

  const values = segments.map((s) => s.value);
  const duplicate = values.find((v, i) => values.indexOf(v) !== i);
  if (duplicate) {
    warnDev(`Duplicate segment value "${duplicate}"; first child wins.`);
  }

  const selectedHints = segments.filter((s) => s.selectedHint);
  if (selectedHints.length > 1) {
    warnDev(
      `Multiple children have selected=true; first wins ("${selectedHints[0]!.value}").`,
    );
  }

  const focusSegmentAt = (index: number) => {
    segmentRefs.current[index]?.focus();
  };

  const onSegmentKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = segments.length - 1;
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        nextIndex = index >= last ? 0 : index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        nextIndex = index <= 0 ? last : index - 1;
        break;
      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        event.preventDefault();
        nextIndex = last;
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        setSelected(segments[index]!.value);
        return;
      default:
        return;
    }

    if (nextIndex != null) focusSegmentAt(nextIndex);
  };

  return (
    <div
      role="radiogroup"
      className={cx(styles["ids-segmented-button"], className)}
      data-ids="ids-segmented-button"
      data-type={type}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {segments.map((seg, index) => {
        const isSelected = seg.value === selected;
        if (seg.kind === "text") {
          return (
            <button
              key={seg.value}
              ref={(el) => {
                segmentRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={seg.ariaLabel}
              title={seg.title}
              tabIndex={0}
              data-ids="ids-segmented-button-segment"
              data-selected={isSelected ? "true" : "false"}
              data-simulated-state={seg.simulatedState}
              data-composite-item-active={isSelected ? "" : undefined}
              className={cx(
                styles["ids-segmented-button__segment"],
                styles["ids-segmented-button__segment--text"],
              )}
              onClick={() => setSelected(seg.value)}
              onKeyDown={(e) => onSegmentKeyDown(e, index)}
            >
              {seg.label}
            </button>
          );
        }

        return (
          <button
            key={seg.value}
            ref={(el) => {
              segmentRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={seg.ariaLabel}
            title={seg.title}
            tabIndex={0}
            data-ids="ids-segmented-button-segment"
            data-selected={isSelected ? "true" : "false"}
            data-simulated-state={seg.simulatedState}
            data-composite-item-active={isSelected ? "" : undefined}
            className={cx(
              styles["ids-segmented-button__segment"],
              styles["ids-segmented-button__segment--icon"],
            )}
            onClick={() => setSelected(seg.value)}
            onKeyDown={(e) => onSegmentKeyDown(e, index)}
          >
            <SegmentGlyph shape={seg.shape} icon={seg.icon} />
          </button>
        );
      })}
    </div>
  );
}

IdsSegmentedButton.displayName = "IdsSegmentedButton";

export default IdsSegmentedButton;
