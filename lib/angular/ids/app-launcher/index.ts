import { IdsAppLauncherComponent } from "./ids-app-launcher.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_APP_LAUNCHER_IMPORTS = [
  IdsAppLauncherComponent,
  IdsIconComponent,
] as const;

export { IdsAppLauncherComponent };

export {
  APP_LAUNCHER_DEFAULT_PRODUCT_ICON,
  APP_LAUNCHER_TRIGGER_ICON,
  APP_SHELL_SPEC_ACCURATE_LAUNCHER_PRODUCTS,
  type IdsAppLauncherProduct,
  type IdsAppLauncherTriggerVariant,
} from "./ids-app-launcher.types";
