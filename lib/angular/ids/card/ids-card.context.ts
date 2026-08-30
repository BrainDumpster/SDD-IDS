import { InjectionToken } from "@angular/core";

/**
 * Optional Dashboard host that overrides Card `showDivider`.
 *
 * When provided (e.g. Dashboard `providers: [{ provide: IDS_DASHBOARD_CARD_OVERRIDE, useExisting: ... }]`),
 * nested Cards use `host.showDividerInCard` instead of the Card's own `showDivider` input.
 *
 * See `components/ids/card/design-spec.md` → Border & divider contract /
 * Parent composition (Dashboard `showDividerInCard`).
 */
export abstract class IdsDashboardCardHost {
  abstract readonly showDividerInCard: boolean;
}

export const IDS_DASHBOARD_CARD_OVERRIDE =
  new InjectionToken<IdsDashboardCardHost>("IDS_DASHBOARD_CARD_OVERRIDE");
