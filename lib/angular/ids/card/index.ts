import { IdsCardComponent } from "./ids-card.component";
import { IdsCardHeaderMenuComponent } from "./ids-card-header-menu.component";
import {
  IdsCardKeyValueContentComponent,
  IdsCardSecondaryTitleComponent,
  IdsCardTextContentComponent,
} from "./ids-card-slots.component";
import { IdsButtonComponent } from "../button/ids-button.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_CARD_IMPORTS = [
  IdsCardComponent,
  IdsCardHeaderMenuComponent,
  IdsCardSecondaryTitleComponent,
  IdsCardTextContentComponent,
  IdsCardKeyValueContentComponent,
  IdsButtonComponent,
  IdsIconComponent,
] as const;

export {
  IdsCardComponent,
  IdsCardHeaderMenuComponent,
  IdsCardSecondaryTitleComponent,
  IdsCardTextContentComponent,
  IdsCardKeyValueContentComponent,
};

export {
  IDS_DASHBOARD_CARD_OVERRIDE,
  IdsDashboardCardHost,
} from "./ids-card.context";

export type {
  IdsCardAction,
  IdsCardKeyValueItem,
  IdsCardMenuOption,
  IdsCardSize,
} from "./ids-card.types";
