/**
 * IDS Icon — framework-agnostic spec contract.
 * Full contract: `components/ids/icon/design-spec.md`
 */
export const IDS_ICON_DESIGN_SPEC_PATH = "components/ids/icon/design-spec.md" as const;

export const ICON_VARIANTS = ["mask", "img", "inline"] as const;
export type IconVariant = (typeof ICON_VARIANTS)[number];

export const ICON_SPEC_ACCURATE_DEFAULTS = {
  shape: "",
  color: undefined as string | undefined,
  size: 24 as number | string,
  variant: "mask" as IconVariant,
  className: undefined as string | undefined,
  title: undefined as string | undefined,
  style: undefined as Record<string, string> | undefined,
} as const;

export type IconModel = {
  shape: string;
  color?: string;
  size?: number | string;
  variant?: IconVariant;
  className?: string;
  title?: string;
  style?: Record<string, string>;
};
