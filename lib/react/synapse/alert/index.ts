/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/alert`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsAlert as SynapseAlert,
  type IdsAlertProps as SynapseAlertProps,
  type IdsAlertDisplay as SynapseAlertDisplay,
  type IdsAlertGlobalSeverity as SynapseAlertGlobalSeverity,
  type IdsAlertInlineSeverity as SynapseAlertInlineSeverity,
  type IdsAlertSeverityFor as SynapseAlertSeverityFor,
  type IdsAlertCarouselProps as SynapseAlertCarouselProps,
  type IdsAlertLink as SynapseAlertLink,
  type IdsAlertBaseProps as SynapseAlertBaseProps,
} from "../../ids/alert";
export {
  IdsAlertGroup as SynapseAlertGroup,
  type IdsAlertGroupProps as SynapseAlertGroupProps,
  type IdsAlertItem as SynapseAlertItem,
} from "../../ids/alert";
