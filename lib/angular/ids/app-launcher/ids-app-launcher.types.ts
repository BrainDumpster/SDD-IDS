/**
 * IDS App Launcher — Angular port for Spec Accurate App Shell / Masthead composition.
 * Source: `components/ids/app-launcher/design-spec.md`
 * Parity: `storybook/src/components/AppLauncher.tsx` (masthead trigger + 2-product surface)
 */
export interface IdsAppLauncherProduct {
  id?: string;
  name: string;
  /** Icon slug; default `shield-encrypt-alt`. Pass empty string for no-icon tile. */
  iconSlug?: string | null;
  href?: string;
}

export type IdsAppLauncherTriggerVariant = "default" | "masthead";
/** Unknown → `ids`. Synapse chrome is CSS-only via `data-programme`. */
export type IdsAppLauncherProgramme = "ids" | "synapse";

export const APP_LAUNCHER_TRIGGER_ICON = "grid-square-9-16" as const;
export const APP_LAUNCHER_DEFAULT_PRODUCT_ICON = "shield-encrypt-alt" as const;

export const APP_SHELL_SPEC_ACCURATE_LAUNCHER_PRODUCTS: IdsAppLauncherProduct[] = [
  { id: "p1", name: "Product Name 1" },
  { id: "p2", name: "Product Name 2" },
];
