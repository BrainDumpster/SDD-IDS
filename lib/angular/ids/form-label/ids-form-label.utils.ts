import {
  FORM_LABEL_SIZES,
  type IdsFormLabelSize,
} from "@component-contracts/ids/form-label.contract";

const SIZE_SET: ReadonlySet<IdsFormLabelSize> = new Set(FORM_LABEL_SIZES);

/** Unknown / incompatible size → `md`. */
export function resolveFormLabelSize(value: unknown): IdsFormLabelSize {
  if (typeof value === "string" && SIZE_SET.has(value as IdsFormLabelSize)) {
    return value as IdsFormLabelSize;
  }
  return "md";
}

/** Coerce Storybook / attribute boolean inputs (`true` | `"true"` | `""`). */
export function resolveFormLabelBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === "";
}
