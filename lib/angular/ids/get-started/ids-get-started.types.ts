import type {
  GetStartedCardState,
  GetStartedOverflowPage,
} from "@component-contracts/ids/get-started.contract";

export type IdsGetStartedCardState = GetStartedCardState;
export type IdsGetStartedOverflowPage = GetStartedOverflowPage;
export type IdsGetStartedOverflowSide = "left" | "right";
export type IdsGetStartedOverflowDirection = "prev" | "next";

export interface IdsGetStartedCardInput {
  id: string | number;
  title: string;
  description?: string;
  /** Legacy alias for `description`. */
  text?: string;
  note?: string;
  icon?: string;
  /** Legacy alias for `icon`. */
  iconShapeName?: string;
  cardState?: IdsGetStartedCardState;
  isDisabled?: boolean;
  isRequired?: boolean;
  isConfigured?: boolean;
  actionButtonText?: string;
  actionButtonTextIfConfigured?: string;
  configureButtonTooltip?: string;
  /** Legacy alias for `configureButtonTooltip`. */
  btnTooltip?: string;
}

export interface IdsGetStartedMastheadProps {
  productName?: string;
  logoShape?: string;
  alertsAriaLabel?: string;
  helpAriaLabel?: string;
  avatarInitials?: string;
  avatarAriaLabel?: string;
}
