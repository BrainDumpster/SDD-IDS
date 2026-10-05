/**
 * IDS Text Box — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/text-box`
 * Source: `components/ids/text-box/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Hierarchy (content projection):
 *   IdsTextBox
 *     control (input | textarea) + optional suffix icon
 *     IdsHelper? | IdsError? — optional message (shared IDS primitives)
 *
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  isValidElement,
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { IdsError } from "../error";
import { IdsHelper } from "../helper";
import { IdsIcon } from "../icon";
import styles from "./IdsTextBox.module.css";
import { IDS_ICON_URL_BY_SHAPE } from "../shared/idsAssetRegistry.generated";

/**
 * How the user last interacted with the page, used to tell a click apart from a
 * Tab when a field takes focus.
 *
 * Tracked on the document rather than on the control, because focus can reach
 * the field without a `pointerdown` ever landing on it — clicking the label, or
 * code calling `focus()` — and a `pointerdown` can land on the control without
 * moving focus at all, by hitting its padding. A per-control flag gets both of
 * those wrong: the label click reads as a Tab, and the stray padding click
 * leaves the flag set so the NEXT Tab reads as a click.
 */
let lastInputModality: "pointer" | "keyboard" = "keyboard";
let modalityTracked = false;

function trackInputModality() {
  if (modalityTracked || typeof document === "undefined") return;
  modalityTracked = true;
  document.addEventListener(
    "pointerdown",
    () => {
      lastInputModality = "pointer";
    },
    true,
  );
  document.addEventListener(
    "keydown",
    () => {
      lastInputModality = "keyboard";
    },
    true,
  );
}

export type IdsTextBoxComponentType = "text-input" | "text-area";
export type IdsTextBoxSize = "large" | "small";
export type IdsTextBoxState =
  | "default"
  | "hover"
  | "selected"
  | "focus"
  | "disabled"
  | "error";

const DEFAULT_ICON_NAME = "mail";
const SHAPE_PATTERN = /^[a-z0-9-]+$/;

const iconUrlByShape: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  try {
    const modules = import.meta.glob<string>("../../../../assets/icons/*.svg", {
      eager: true,
      query: "?url",
      import: "default",
    });
    for (const path of Object.keys(modules)) {
      const file = path.replace(/^.*\/([^/]+)\.svg$/, "$1");
      if (file && modules[path] != null) {
        out[file] = modules[path] as string;
      }
    }
  } catch {
    // Non-Vite bundler (esbuild): `import.meta.glob` is not a function. Fall through.
  }
  // Vite populates `out` and this returns it unchanged (behaviour is byte-identical).
  // esbuild leaves it EMPTY, which would render every icon as a missing box -- use the
  // generated registry (scripts/generate_ids_asset_registry.mjs) in that case.
  return Object.keys(out).length > 0 ? out : IDS_ICON_URL_BY_SHAPE;
})();

function hasIconAsset(shape: string): boolean {
  return SHAPE_PATTERN.test(shape) && Boolean(iconUrlByShape[shape]);
}

export interface IdsTextBoxProps {
  children?: ReactNode;
  componentType?: IdsTextBoxComponentType;
  size?: IdsTextBoxSize;
  /** Demo/testing visual override only — must not block runtime interaction. */
  state?: IdsTextBoxState;
  label?: string;
  showLabel?: boolean;
  required?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  showIcon?: boolean;
  iconName?: string;
  id?: string;
  name?: string;
  rows?: number;
  inputType?: string;
  /**
   * Figma: "Select text when in focus". Keyboard focus only (`Tab` /
   * `Shift+Tab`), same for text input and text area.
   *
   * - `true` (default): selects the whole value so typing replaces it — simple
   *   values that are usually re-entered (name, location).
   * - `false`: puts the caret at the end — values that are usually edited in
   *   part, where replacing them by accident loses data (IP address, path).
   *
   * A previous selection is never restored. Pointer focus is untouched — a
   * click always places the caret where the user clicked.
   */
  selectOnFocus?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveComponentType(value: unknown): IdsTextBoxComponentType {
  return value === "text-area" ? "text-area" : "text-input";
}

function resolveSize(value: unknown): IdsTextBoxSize {
  return value === "small" ? "small" : "large";
}

function resolveState(value: unknown): IdsTextBoxState {
  if (
    value === "hover" ||
    value === "selected" ||
    value === "focus" ||
    value === "disabled" ||
    value === "error"
  ) {
    return value;
  }
  return "default";
}

function isHelperElement(child: ReactElement): boolean {
  return (
    child.type === IdsHelper ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsHelper")
  );
}

function isErrorElement(child: ReactElement): boolean {
  return (
    child.type === IdsError ||
    (typeof child.type === "function" &&
      (child.type as { displayName?: string }).displayName === "IdsError")
  );
}

function partitionChildren(children: ReactNode): {
  helper: ReactElement | null;
  error: ReactElement | null;
} {
  let helper: ReactElement | null = null;
  let error: ReactElement | null = null;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isHelperElement(child)) helper = child;
    else if (isErrorElement(child)) error = child;
  });
  return { helper, error };
}

export function IdsTextBox({
  children,
  componentType: componentTypeProp = "text-input",
  size: sizeProp = "large",
  state: stateProp = "default",
  label,
  showLabel = true,
  required = false,
  placeholder,
  value,
  defaultValue,
  disabled = false,
  invalid = false,
  showIcon = true,
  iconName = DEFAULT_ICON_NAME,
  id,
  name,
  rows = 4,
  inputType = "text",
  selectOnFocus = true,
  ariaLabel,
  ariaDescribedBy,
  onValueChange,
  className,
}: IdsTextBoxProps) {
  const reactId = useId();
  /**
   * Focus modality.
   *
   * `:focus-visible` cannot separate pointer focus from keyboard focus on a text
   * field: per the CSS spec a focused `input` / `textarea` ALWAYS matches
   * `:focus-visible`, because it accepts keyboard input. That makes the
   * design-spec's pointer-focus rule (`:focus:not(:focus-visible)` -> selected
   * border, no ring) unreachable, so clicking the field wrongly showed the
   * keyboard ring. Track the modality ourselves and expose it on the control.
   */
  useEffect(trackInputModality, []);
  const [focusModality, setFocusModality] = useState<"pointer" | "keyboard" | null>(null);
  const inputId = id ?? `ids-text-box-${reactId}`;
  const messageId = `${inputId}-message`;

  const componentType = resolveComponentType(componentTypeProp);
  const size = resolveSize(sizeProp);
  const demoState = resolveState(stateProp);

  const { helper, error: errorMessage } = partitionChildren(children);
  if (helper && errorMessage) {
    throw new Error("IdsTextBox: project either `IdsHelper` or `IdsError`, not both.");
  }

  const isDisabled = Boolean(disabled || demoState === "disabled");
  const hasError = Boolean(errorMessage || invalid || demoState === "error");

  const visualState: IdsTextBoxState = isDisabled
    ? "disabled"
    : hasError
      ? "error"
      : demoState;

  const shouldRenderLabel = showLabel && Boolean(label);
  const message = errorMessage ?? helper;

  const describedBy =
    [ariaDescribedBy, message ? messageId : undefined].filter(Boolean).join(" ") || undefined;

  const useTextArea = componentType === "text-area";
  // small valid for text-input only; text-area ignores small height constraint
  const sizeClass = useTextArea
    ? styles["ids-text-box-control--text-area"]
    : size === "small"
      ? styles["ids-text-box-control--small"]
      : styles["ids-text-box-control--large"];

  const showSuffix = showIcon && hasIconAsset(iconName);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onValueChange?.(event.target.value);
  };

  const projectedMessage =
    message != null
      ? React.cloneElement(message as ReactElement<{ id?: string; disabled?: boolean }>, {
          id: messageId,
          disabled: isDisabled,
        })
      : null;

  const sharedFieldProps = {
    id: inputId,
    name,
    placeholder,
    disabled: isDisabled,
    value,
    defaultValue,
    "aria-invalid": hasError ? true : undefined,
    "aria-required": required ? true : undefined,
    "aria-describedby": describedBy,
    // Spec: aria-label is fallback when no visible label; placeholder is never the label
    "aria-label": shouldRenderLabel ? undefined : ariaLabel,
    onChange: handleChange,
    onFocus: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const byPointer = lastInputModality === "pointer";
      setFocusModality(byPointer ? "pointer" : "keyboard");
      // A click already placed the caret where the user aimed — leave it alone.
      if (byPointer) return;
      const field = event.currentTarget;
      const applySelection = () => {
        // A fast Tab can move on before the next frame; leave that field alone.
        if (document.activeElement !== field) return;
        if (selectOnFocus) {
          field.select();
          return;
        }
        // `email`, `number` and similar types have no caret API and throw on
        // `setSelectionRange`; they keep the browser's own Tab behaviour.
        if (field.selectionStart === null) return;
        const end = field.value.length;
        field.setSelectionRange(end, end);
      };
      // Browsers select the whole value when you Tab into a field, and some do it
      // after this handler runs. Apply it now so there is no flash of highlighted
      // text, then again on the next frame so the result sticks either way.
      applySelection();
      requestAnimationFrame(applySelection);
    },
    onBlur: () => {
      setFocusModality(null);
    },
  };

  const fieldGroup = (
    <div
      className={cx(styles["ids-text-box"], !shouldRenderLabel && className)}
      data-ids="ids-text-box"
      data-error={hasError ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
    >
      <div
        className={cx(styles["ids-text-box-control"], sizeClass)}
        data-ids="ids-text-box-control"
        data-state={visualState !== "default" ? visualState : undefined}
        data-focus-modality={focusModality ?? undefined}
        onPointerDown={(event) => {
          // Clicking a field that is ALREADY focused fires no focus event, so the
          // modality set when it was tabbed into would stick and keep the keyboard
          // ring on a field the user is now pointing at.
          if (event.currentTarget.contains(document.activeElement)) {
            setFocusModality("pointer");
          }
        }}
      >
        {useTextArea ? (
          <textarea
            className={styles["ids-text-box-value"]}
            data-ids="ids-text-box-textarea"
            rows={rows}
            {...(sharedFieldProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={styles["ids-text-box-value"]}
            data-ids="ids-text-box-input"
            type={inputType}
            {...(sharedFieldProps as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {showSuffix ? (
          <span
            className={styles["ids-text-box-suffix-icon"]}
            data-ids="ids-text-box-suffix-icon"
            aria-hidden="true"
          >
            <IdsIcon shape={iconName} size={16} color="currentColor" />
          </span>
        ) : null}
      </div>

      {projectedMessage}
    </div>
  );

  if (!shouldRenderLabel) {
    return fieldGroup;
  }

  return (
    <div
      className={cx(styles["ids-text-box-field"], className)}
      data-ids="ids-text-box-field"
    >
      <label
        className={styles["ids-text-box-label"]}
        data-ids="ids-text-box-label"
        htmlFor={inputId}
      >
        {label}
        {required ? (
          <span
            className={styles["ids-text-box-required-mark"]}
            data-ids="ids-text-box-required-mark"
            aria-hidden="true"
          >
            *
          </span>
        ) : null}
      </label>
      {fieldGroup}
    </div>
  );
}

IdsTextBox.displayName = "IdsTextBox";

export default IdsTextBox;
