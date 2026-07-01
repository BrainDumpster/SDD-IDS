import { IdsBadgeComponent } from "../ids-badge/ids-badge.component";
import { IdsDropdownComponent } from "./ids-dropdown.component";
import { IdsDropdownErrorComponent } from "./ids-dropdown-error.component";
import { IdsDropdownHelperComponent } from "./ids-dropdown-helper.component";
import { IdsDropdownMenuComponent } from "./ids-dropdown-menu.component";
import { IdsDropdownMenuFooterComponent } from "./ids-dropdown-menu-footer.component";
import { IdsDropdownMenuGroupComponent } from "./ids-dropdown-menu-group.component";
import { IdsDropdownMenuItemComponent } from "./ids-dropdown-menu-item.component";
import { IdsDropdownTagComponent } from "./ids-dropdown-tag.component";
import { IdsDropdownTriggerShellComponent } from "./ids-dropdown-trigger-shell.component";

/** Import wherever IDS dropdown composition markup is used. */
export const IDS_DROPDOWN_IMPORTS = [
  IdsDropdownComponent,
  IdsDropdownMenuComponent,
  IdsDropdownTriggerShellComponent,
  IdsDropdownMenuGroupComponent,
  IdsDropdownMenuItemComponent,
  IdsDropdownMenuFooterComponent,
  IdsDropdownHelperComponent,
  IdsDropdownErrorComponent,
  IdsDropdownTagComponent,
  IdsBadgeComponent,
] as const;

export {
  IdsDropdownComponent,
  IdsDropdownMenuComponent,
  IdsDropdownTriggerShellComponent,
  IdsDropdownMenuGroupComponent,
  IdsDropdownMenuItemComponent,
  IdsDropdownMenuFooterComponent,
  IdsDropdownHelperComponent,
  IdsDropdownErrorComponent,
  IdsDropdownTagComponent,
};
