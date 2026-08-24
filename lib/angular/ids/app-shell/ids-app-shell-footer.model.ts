/** Resolved footer fields after flat + bundle merge (design-spec Footer passthrough). */
export interface IdsFooterBundleFields {
  hostname?: string;
  swid?: string;
  currentDateTime?: string;
  timeZoneLabel?: string;
  showHostname: boolean;
  showCurrentDateAndTime: boolean;
  showTimeZone: boolean;
  copyDisabled: boolean;
  timeZoneDisabled: boolean;
}
