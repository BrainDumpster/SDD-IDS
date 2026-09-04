import { IdsTooltip } from "./IdsTooltip";
import styles from "./Badge.module.css";



type BadgeType = "default" | "controls" | "critical" | "warning" | "disabled" | "success";



interface BadgeProps {

  value: string | number;

  type?: BadgeType;

  ariaLabel?: string;

}



export function Badge({

  value,

  type = "default",

  ariaLabel,

}: BadgeProps) {

  const valueText = String(value);

  const numericValue = Number(value);

  const isLargeNumber = !Number.isNaN(numericValue) && numericValue >= 999;

  const displayText = isLargeNumber ? "1K" : valueText;

  const digitCount = displayText.length;

  const sizeClass =

    digitCount <= 1

      ? styles.singleDigit

      : digitCount === 2

        ? styles.twoDigits

        : styles.threePlusDigits;



  const badge = (

    <span

      className={[

        styles.badge,

        styles[type],

        sizeClass,

      ].join(" ")}

      aria-label={ariaLabel ?? (isLargeNumber ? valueText : undefined)}

    >

      <span className={styles.content}>{displayText}</span>

    </span>

  );



  if (isLargeNumber) {

    return (

      <IdsTooltip content={valueText} side="top" hugContent>

        {badge}

      </IdsTooltip>

    );

  }



  return badge;

}

