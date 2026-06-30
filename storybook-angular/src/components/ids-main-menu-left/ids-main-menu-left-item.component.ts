import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  forwardRef,
  inject,
} from "@angular/core";
import { NgClass } from "@angular/common";
import type { MainMenuLeftPrimaryState } from "@component-contracts/ids/main-menu-left.contract";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_MAIN_MENU_LEFT_CONTEXT, IDS_MAIN_MENU_LEFT_GROUP_CONTEXT } from "./ids-main-menu-left-context";

@Component({
  selector: "ids-main-menu-left-item",
  standalone: true,
  imports: [NgClass, IdsIconComponent],
  templateUrl: "./ids-main-menu-left-item.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class IdsMainMenuLeftItemComponent {
  readonly root = inject(IDS_MAIN_MENU_LEFT_CONTEXT);
  readonly group = inject(IDS_MAIN_MENU_LEFT_GROUP_CONTEXT, { optional: true });

  @Input({ required: true }) itemId!: string;
  @Input() level: "primary" | "secondary" = "primary";
  @Input() forceState?: MainMenuLeftPrimaryState;
  @Input() tooltip = "";

  get isPrimary(): boolean {
    return this.level === "primary";
  }

  get isSecondary(): boolean {
    return this.level === "secondary";
  }

  get groupId(): string | undefined {
    return this.group?.groupId;
  }

  get rowClasses(): string[] {
    if (this.isSecondary) {
      return [
        "ids-main-menu-left__secondary-row",
        "ids-main-menu-left__secondary-row--interactive",
        this.root.isSecondarySelected(this.itemId, this.groupId ?? "")
          ? "ids-main-menu-left__secondary-row--selected"
          : "",
      ].filter(Boolean);
    }
    return [
      "ids-main-menu-left__primary-row",
      !(this.root.forceStates && this.forceState)
        ? "ids-main-menu-left__primary-row--interactive"
        : "",
      this.root.stateClass(this.itemId, this.forceState),
      this.groupId && this.root.hasSelectedSecondaryInGroup(this.groupId)
        ? "ids-main-menu-left__primary-row--secondary-parent-selected"
        : "",
      this.root.showPrimaryInset(this.itemId, this.groupId, this.forceState)
        ? "ids-main-menu-left__primary-row--selected"
        : "",
    ].filter(Boolean);
  }

  get showChevron(): boolean {
    return Boolean(this.isPrimary && this.groupId && this.root.showChevronForGroup(this.groupId));
  }

  get chevronShape(): string {
    if (!this.groupId) return "chev-right-thick";
    return this.root.isGroupChildrenVisible(this.groupId)
      ? "chev-down-thick"
      : "chev-right-thick";
  }

  onActivate(event: MouseEvent): void {
    if (this.root.forceStates && this.forceState) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("a,button,[routerlink]")) {
      // Let projected link hosts handle navigation; still update selection below.
    }
    const label = this.tooltip || this.itemId;
    if (this.isSecondary && this.groupId) {
      this.root.onSecondaryActivate(this.itemId, this.groupId, label);
      return;
    }
    this.root.onPrimaryActivate(this.itemId, label, this.groupId);
    if (this.groupId) {
      event.preventDefault();
      this.root.toggleGroup(this.groupId);
    }
  }
}

@Component({
  selector: "ids-main-menu-left-item-icon",
  standalone: true,
  imports: [IdsIconComponent],
  template: `
    <ids-icon
      className="ids-main-menu-left__primary-icon"
      [shapeName]="shapeName"
      variant="mask"
      [size]="16"
    />
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsMainMenuLeftItemIconComponent {
  @Input({ required: true }) shapeName!: string;
}

@Component({
  selector: "ids-main-menu-left-children",
  standalone: true,
  template: `
    <div
      class="ids-main-menu-left__secondary-section"
      [class.ids-main-menu-left__secondary-section--hidden]="
        group && !root.isGroupChildrenVisible(group.groupId)
      "
    >
      <ng-content />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsMainMenuLeftChildrenComponent {
  readonly root = inject(IDS_MAIN_MENU_LEFT_CONTEXT);
  readonly group = inject(IDS_MAIN_MENU_LEFT_GROUP_CONTEXT, { optional: true });
}

@Component({
  selector: "ids-main-menu-left-group",
  standalone: true,
  template: `<div class="ids-main-menu-left__item-block"><ng-content /></div>`,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: IDS_MAIN_MENU_LEFT_GROUP_CONTEXT,
      useExisting: forwardRef(() => IdsMainMenuLeftGroupComponent),
    },
  ],
})
export class IdsMainMenuLeftGroupComponent implements OnInit, OnDestroy {
  private readonly root = inject(IDS_MAIN_MENU_LEFT_CONTEXT);

  @Input({ required: true }) groupId!: string;
  @Input() defaultExpanded = false;

  ngOnInit(): void {
    this.root.registerGroup({
      groupId: this.groupId,
      defaultExpanded: this.defaultExpanded,
      childrenMenuPinned: this.root.forceStates,
    });
  }

  ngOnDestroy(): void {
    this.root.unregisterGroup(this.groupId);
  }
}

@Component({
  selector: "ids-main-menu-left-logo",
  standalone: true,
  template: `
    <div class="ids-main-menu-left__logo-slot">
      <ng-content />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsMainMenuLeftLogoComponent {}
