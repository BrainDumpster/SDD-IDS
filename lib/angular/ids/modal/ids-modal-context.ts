import { InjectionToken } from "@angular/core";
import type {
  ModalDialogType,
  ModalLayer,
  ModalPage,
  ModalScenario,
} from "@component-contracts/ids/modal.contract";

export interface IdsModalContext {
  readonly titleId: string;
  readonly descriptionId: string;
  readonly type: ModalDialogType;
  readonly resolvedScenario: ModalScenario;
  readonly footerCheckbox: boolean;
  readonly footerCheckboxLabel: string;
  readonly showTabs: boolean;
  readonly pages: ModalPage[];
  readonly activePage: string;
  readonly activePageContent: string;
  readonly bodyScrollable: boolean;
  readonly descriptionTypeClass: string;
  readonly contentTypeClass: string;
  isPageActive(pageId: string): boolean;
  selectPage(pageId: string): void;
  registerContentElement(element: HTMLElement | null): void;
  onContentScroll(): void;
  closeModal(): void;
}

export const IDS_MODAL_CONTEXT = new InjectionToken<IdsModalContext>("IDS_MODAL_CONTEXT");
