/**
 * IDS Error — framework-agnostic spec contract.
 * Composition: IdsErrorComponent > IdsErrorIconComponent + IdsErrorTextComponent
 */
export const IDS_ERROR_DESIGN_SPEC_PATH = "components/ids/error/design-spec.md" as const;

export const ERROR_SPEC_ACCURATE_DEFAULTS = {
  id: undefined as string | undefined,
  className: undefined as string | undefined,
} as const;

export const ERROR_TEXT_SPEC_ACCURATE_DEFAULTS = {
  text: undefined as string | undefined,
  className: undefined as string | undefined,
} as const;

export const ERROR_ICON_SPEC_ACCURATE_DEFAULTS = {
  shape: "error" as string,
  size: 16 as number,
  className: undefined as string | undefined,
} as const;
