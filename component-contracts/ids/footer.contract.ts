/**
 * IDS Footer — framework-agnostic spec contract.
 * Full contract: `components/ids/footer/design-spec.md`
 */
export const IDS_FOOTER_DESIGN_SPEC_PATH = "components/ids/footer/design-spec.md" as const;

export const FOOTER_SPEC_ACCURATE_DEFAULTS = {
  hostname: "short_name_first_domain_name",
  swid: "ELMCR00222GBPB",
  currentDateTime: "Tue, 2023-04-23 12:30 AM",
  timeZoneLabel: "Eastern Time (US & Canada)",
  showHostname: true,
  showCurrentDateAndTime: true,
  showTimeZone: true,
  copyDisabled: false,
  timeZoneDisabled: false,
} as const;

export type FooterModel = typeof FOOTER_SPEC_ACCURATE_DEFAULTS;
