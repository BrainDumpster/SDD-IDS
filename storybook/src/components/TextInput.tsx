import { Field } from "@base-ui-components/react/field";
import { Input } from "@base-ui-components/react/input";
import type { ComponentProps } from "react";
import styles from "./TextInput.module.css";

type Size = "sm" | "md" | "lg";

interface TextInputProps extends Omit<ComponentProps<"input">, "size"> {
  label: string;
  helperText?: string;
  errorText?: string;
  size?: Size;
  invalid?: boolean;
}

export function TextInput({
  label,
  helperText,
  errorText,
  size = "md",
  invalid,
  disabled,
  ...rest
}: TextInputProps) {
  return (
    <Field.Root
      className={styles.field}
      invalid={invalid}
      disabled={disabled}
    >
      <Field.Label className={styles.label}>{label}</Field.Label>
      <Input
        className={(state) =>
          [
            styles.input,
            styles[size],
            state.focused ? styles.focused : "",
            invalid ? styles.invalid : "",
          ]
            .filter(Boolean)
            .join(" ")
        }
        {...rest}
      />
      {invalid && errorText ? (
        <Field.Error className={styles.error}>{errorText}</Field.Error>
      ) : helperText ? (
        <Field.Description className={styles.helper}>
          {helperText}
        </Field.Description>
      ) : null}
    </Field.Root>
  );
}
