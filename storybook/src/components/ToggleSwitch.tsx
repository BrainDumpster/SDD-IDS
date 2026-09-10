import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import { useState } from "react";
import styles from "./ToggleSwitch.module.css";

export interface ToggleSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  /** Default `true`. Renders the `On`/`Off` status text. */
  showStatus?: boolean;
  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function ToggleSwitch({
  checked: checkedProp,
  defaultChecked = false,
  disabled = false,
  showStatus = true,
  id,
  name,
  ariaLabel,
  ariaDescribedBy,
  onCheckedChange,
}: ToggleSwitchProps) {
  const isControlled = checkedProp !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(
    Boolean(defaultChecked),
  );
  const checked = isControlled ? Boolean(checkedProp) : uncontrolledChecked;

  return (
    <label className={styles.root}>
      <BaseSwitch.Root
        id={id}
        name={name}
        checked={isControlled ? checked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={styles.switch}
        onCheckedChange={(next) => {
          if (!isControlled) {
            setUncontrolledChecked(next);
          }
          onCheckedChange?.(next);
        }}
      >
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
      {showStatus ? (
        <span className={styles.status}>{checked ? "On" : "Off"}</span>
      ) : null}
    </label>
  );
}
