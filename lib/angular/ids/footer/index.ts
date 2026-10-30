import { IdsFooterComponent } from "./ids-footer.component";
import {
  IdsFooterHostNameComponent,
  IdsFooterLeftRegionComponent,
  IdsFooterSwidGroupComponent,
  IdsFooterTimeGroupComponent,
  IdsFooterTimeZoneGroupComponent,
} from "./ids-footer-slots.component";

/** Import this array wherever footer composition markup is used. */
export const IDS_FOOTER_IMPORTS = [
  IdsFooterComponent,
  IdsFooterLeftRegionComponent,
  IdsFooterHostNameComponent,
  IdsFooterSwidGroupComponent,
  IdsFooterTimeGroupComponent,
  IdsFooterTimeZoneGroupComponent,
] as const;

export {
  IdsFooterComponent,
  IdsFooterLeftRegionComponent,
  IdsFooterHostNameComponent,
  IdsFooterSwidGroupComponent,
  IdsFooterTimeGroupComponent,
  IdsFooterTimeZoneGroupComponent,
};
