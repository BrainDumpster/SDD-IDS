/**
 * IDS Toggle Switch — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/toggle-switch`
 * Source: `components/ids/toggle-switch/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (deterministic slot order):
 *   root → input → switch → track → thumb → label? → assistiveText?
 *
 * No @base-ui-components dependency. Native checkbox for a11y + forms.
 */

import React, {
  useId,
  useState,
  type ChangeEvent,
  type ReactElement,
} from "react";
import styles from "./IdsToggleSwitch.module.css";

export interface IdsToggleSwitchProps {
  /** Controlled checked value. */
  checked?: boolean;
  /** Uncontrolled initial checked value. */
  defaultChecked?: boolean;
  /** Emitted once per successful toggle. */
  onCheckedChange?: (checked: boolean) => void;
  /** Default `false`. Blocks pointer/keyboard toggles; emits no change. */
  disabled?: boolean;
  /** Default `true`. Renders the `On`/`Off` status text. */
  showStatus?: boolean;
  id?: string;
  name?: string;
  value?: string;
  /** Required accessible name (visible text is On/Off status only). */
  "aria-label"?: string;
  /** Optional helper/description association. */
  "aria-describedby"?: string;
  className?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function IdsToggleSwitch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  showStatus = true,
  id: idProp,
  name,
  value,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  className,
}: IdsToggleSwitchProps): ReactElement {
  const reactId = useId();
  const inputId = idProp ?? `ids-toggle-switch-${reactId}`;

  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    Boolean(defaultChecked),
  );
  const checked = isControlled ? Boolean(checkedProp) : uncontrolledChecked;
  const isDisabled = Boolean(disabled);
  const hasStatus = Boolean(showStatus);

  if (ariaLabel == null || String(ariaLabel).trim() === "") {
    // Validation checklist: accessible name required (visible text is On/Off status only).
    // eslint-disable-next-line no-console
    console.error(
      "IdsToggleSwitch: accessible name required — provide `aria-label`.",
    );
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    const next = event.target.checked;
    if (!isControlled) {
      setUncontrolledChecked(next);
    }
    onCheckedChange?.(next);
  };

  return (
    <label
      className={cx(styles["ids-toggle-switch"], className)}
      data-ids="ids-toggle-switch"
      data-checked={checked ? "true" : "false"}
      data-disabled={isDisabled ? "true" : "false"}
      data-has-status={hasStatus ? "true" : "false"}
      htmlFor={inputId}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        className={styles["ids-toggle-switch-input"]}
        name={name}
        value={value}
        checked={isControlled ? checked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        disabled={isDisabled}
        aria-checked={checked}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        data-ids="ids-toggle-switch-input"
        onChange={handleChange}
      />
      <span
        className={styles["ids-toggle-switch-switch"]}
        data-ids="ids-toggle-switch-switch"
        aria-hidden="true"
      >
        <span
          className={styles["ids-toggle-switch-track"]}
          data-ids="ids-toggle-switch-track"
        >
          <span
            className={styles["ids-toggle-switch-thumb"]}
            data-ids="ids-toggle-switch-thumb"
          />
        </span>
      </span>
      {hasStatus ? (
        <span
          className={styles["ids-toggle-switch-status"]}
          data-ids="ids-toggle-switch-status"
        >
          {checked ? "On" : "Off"}
        </span>
      ) : null}
    </label>
  );
}

IdsToggleSwitch.displayName = "IdsToggleSwitch";

export default IdsToggleSwitch;
