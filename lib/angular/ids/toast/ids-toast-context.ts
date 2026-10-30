import { InjectionToken } from "@angular/core";
import type {
  IdsToastCloseReason,
  IdsToastLink,
  IdsToastRole,
  IdsToastType,
} from "@component-contracts/ids/toast.contract";

export interface IdsToastItemContext {
  readonly resolvedId: string | undefined;
  readonly resolvedType: IdsToastType;
  readonly resolvedMessage: string;
  readonly resolvedClosable: boolean;
  readonly resolvedLink: IdsToastLink | null;
  readonly resolvedRole: IdsToastRole;
  readonly iconShape: string;
  readonly queuedVisible: boolean;
  readonly dismissed: boolean;
  readonly showLink: boolean;
  readonly preferRouter: boolean;
  readonly hasHref: boolean;
  dismiss(reason: IdsToastCloseReason): void;
  onViewDetailsActivate(event: MouseEvent): void;
}

export const IDS_TOAST_ITEM_CONTEXT = new InjectionToken<IdsToastItemContext>(
  "IDS_TOAST_ITEM_CONTEXT",
);
