import { InjectionToken } from "@angular/core";
import type { ModalPage, ModalScenario } from "@component-contracts/ids/modal.contract";

export interface IdsModalContext {
  readonly titleId: string;
  readonly descriptionId: string;
  readonly resolvedScenario: ModalScenario;
  readonly footerCheckbox: boolean;
  readonly footerCheckboxLabel: string;
  readonly showFooterBorder: boolean;
  readonly showTabs: boolean;
  readonly pages: ModalPage[];
  readonly activePage: string;
  readonly activePageContent: string;
  readonly bodyScrollable: boolean;
  isPageActive(pageId: string): boolean;
  selectPage(pageId: string): void;
  registerContentElement(element: HTMLElement | null): void;
  onContentScroll(): void;
}

export const IDS_MODAL_CONTEXT = new InjectionToken<IdsModalContext>("IDS_MODAL_CONTEXT");
