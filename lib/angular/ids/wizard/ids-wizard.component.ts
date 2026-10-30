import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { WIZARD_DEFAULTS } from "@component-contracts/ids/wizard.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { cx } from "../../shared/utils/cx";
import { IDS_WIZARD_CONTEXT, type IdsWizardRuntimeContext } from "./ids-wizard-context";
import {
  IdsWizardBodyComponent,
  IdsWizardCancelButtonComponent,
  IdsWizardCloseActionComponent,
  IdsWizardContentPaneComponent,
  IdsWizardFooterActionsComponent,
  IdsWizardFooterComponent,
  IdsWizardHeaderComponent,
  IdsWizardHeaderTitleComponent,
  IdsWizardPageContentComponent,
  IdsWizardPageTitleComponent,
  IdsWizardPreviousButtonComponent,
  IdsWizardPrimaryButtonComponent,
  IdsWizardProgressLabelComponent,
  IdsWizardStepItemComponent,
  IdsWizardStepLabelComponent,
  IdsWizardStepStatusIndicatorComponent,
  IdsWizardStepsPaneComponent,
  IdsWizardSubstepItemComponent,
  IdsWizardSubstepListComponent,
} from "./ids-wizard-slots.component";
import type {
  IdsWizardContext,
  IdsWizardDisplayStep,
  IdsWizardEventPayload,
  IdsWizardMode,
  IdsWizardSize,
  IdsWizardStepContent,
  IdsWizardStepInput,
  IdsWizardStepStatus,
  IdsWizardVisibleNode,
} from "./ids-wizard.types";
import {
  consolidatedStatus,
  flattenVisible,
  payloadFromNode,
  resolveMode,
  resolveSize,
  resolveStatusIcon,
  toStepCode,
} from "./ids-wizard.utils";

let wizardInstanceCounter = 0;

@Component({
  selector: "ids-wizard",
  standalone: true,
  imports: [
    CommonModule,
    IdsWizardHeaderComponent,
    IdsWizardHeaderTitleComponent,
    IdsWizardCloseActionComponent,
    IdsWizardBodyComponent,
    IdsWizardStepsPaneComponent,
    IdsWizardStepItemComponent,
    IdsWizardStepLabelComponent,
    IdsWizardStepStatusIndicatorComponent,
    IdsWizardSubstepListComponent,
    IdsWizardSubstepItemComponent,
    IdsWizardContentPaneComponent,
    IdsWizardPageTitleComponent,
    IdsWizardPageContentComponent,
    IdsWizardFooterComponent,
    IdsWizardProgressLabelComponent,
    IdsWizardFooterActionsComponent,
    IdsWizardCancelButtonComponent,
    IdsWizardPreviousButtonComponent,
    IdsWizardPrimaryButtonComponent,
    IdsIconComponent,
  ],
  templateUrl: "./ids-wizard.component.html",
  styleUrl: "./ids-wizard.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: IDS_WIZARD_CONTEXT, useExisting: IdsWizardComponent }],
})
export class IdsWizardComponent implements IdsWizardRuntimeContext, OnInit, AfterContentInit, OnChanges {
  @ContentChild(IdsWizardHeaderComponent) headerSlot?: IdsWizardHeaderComponent;
  @ContentChild(IdsWizardBodyComponent) bodySlot?: IdsWizardBodyComponent;

  @Input() mode: IdsWizardMode = WIZARD_DEFAULTS.mode;
  @Input() size: IdsWizardSize = WIZARD_DEFAULTS.size;
  @Input() title = WIZARD_DEFAULTS.title;
  @Input() steps: IdsWizardStepInput[] = [];
  @Input() initialStepId?: string;
  @Input() showCloseButton = WIZARD_DEFAULTS.showCloseButton;
  @Input() isPrimaryEnabled: boolean | ((ctx: IdsWizardContext) => boolean) = true;
  @Input() className?: string;
  @Input() id?: string;

  @Output() readonly onCancel = new EventEmitter<IdsWizardEventPayload>();
  @Output() readonly onPrevious = new EventEmitter<IdsWizardEventPayload>();
  @Output() readonly onNext = new EventEmitter<IdsWizardEventPayload>();
  @Output() readonly onFinish = new EventEmitter<IdsWizardEventPayload>();
  @Output() readonly onStepChange = new EventEmitter<IdsWizardEventPayload>();

  readonly generatedId = `ids-wizard-${++wizardInstanceCounter}`;

  currentStepId?: string;
  display: IdsWizardDisplayStep[] = [];
  leaves: IdsWizardVisibleNode[] = [];
  currentLeaf?: IdsWizardVisibleNode;
  hasCompoundSlots = false;
  private lastStepChangeKey = "";

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.syncCurrentLeaf();
  }

  ngAfterContentInit(): void {
    this.hasCompoundSlots = Boolean(this.headerSlot || this.bodySlot);
    this.syncCurrentLeaf();
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["steps"] || changes["initialStepId"] || changes["mode"] || changes["size"]) {
      this.syncCurrentLeaf();
    }
  }

  get rootId(): string {
    return this.id || this.generatedId;
  }

  get titleId(): string {
    return `${this.rootId}-title`;
  }

  get resolvedMode(): IdsWizardMode {
    return resolveMode(this.mode);
  }

  get resolvedSize(): IdsWizardSize {
    return resolveSize(this.size);
  }

  get wizardCtx(): IdsWizardContext {
    return { currentStepId: this.currentStepId };
  }

  get currentIndex(): number {
    if (!this.currentLeaf) {
      return -1;
    }
    return this.leaves.findIndex((leaf) => leaf.node.id === this.currentLeaf?.node.id);
  }

  get isFirstLeaf(): boolean {
    return this.currentIndex <= 0;
  }

  get isLastLeaf(): boolean {
    return this.currentIndex === this.leaves.length - 1 && this.currentIndex >= 0;
  }

  get currentPayload(): IdsWizardEventPayload | null {
    return this.currentLeaf ? payloadFromNode(this.currentLeaf) : null;
  }

  get primaryEnabled(): boolean {
    const resolved =
      typeof this.isPrimaryEnabled === "function"
        ? this.isPrimaryEnabled(this.wizardCtx)
        : this.isPrimaryEnabled;
    return Boolean(resolved && this.currentLeaf);
  }

  get footerOverrides() {
    return this.currentLeaf?.node.footerButtons;
  }

  get showCancel(): boolean {
    return this.footerOverrides?.showCancel ?? true;
  }

  get showPrevious(): boolean {
    return this.footerOverrides?.showPrevious ?? true;
  }

  get primaryLabel(): string {
    return this.footerOverrides?.primaryLabel ?? (this.isLastLeaf ? "Finish" : "Next");
  }

  get progressLabel(): string {
    const total = this.display.length;
    if (this.currentLeaf && total > 0) {
      return `Step ${toStepCode(this.currentLeaf.topLevelIndex, this.currentLeaf.childIndex)} of ${total}`;
    }
    return `Step 0 of ${total}`;
  }

  get showClose(): boolean {
    return this.resolvedMode === "modal" ? true : this.showCloseButton;
  }

  get pageTitle(): string {
    return this.currentLeaf?.node.pageTitle ?? this.currentLeaf?.node.label ?? "Page";
  }

  get pageContent(): IdsWizardStepContent | undefined {
    return this.currentLeaf?.node.content;
  }

  get wizardClass(): string {
    return cx(
      "ids-wizard",
      `ids-wizard--${this.resolvedSize}`,
      this.resolvedMode === "modal" ? "ids-wizard--modal" : "",
      this.className,
    );
  }

  isTemplateRef(value: IdsWizardStepContent | undefined): value is TemplateRef<unknown> {
    return value instanceof TemplateRef;
  }

  groupStatus(group: IdsWizardDisplayStep): IdsWizardStepStatus {
    return consolidatedStatus(group);
  }

  groupIcon(group: IdsWizardDisplayStep): string | undefined {
    return resolveStatusIcon(group.top.node, this.groupStatus(group));
  }

  groupLeafStatus(group: IdsWizardDisplayStep): IdsWizardStepStatus {
    return group.children.length > 0
      ? this.groupStatus(group)
      : (group.top.node.status ?? "none");
  }

  isGroupActive(group: IdsWizardDisplayStep): boolean {
    if (!this.currentLeaf) {
      return false;
    }
    const groupHasChildren = group.children.length > 0;
    return (
      (groupHasChildren && this.currentLeaf.parentId === group.top.node.id) ||
      (!groupHasChildren && this.currentLeaf.node.id === group.top.node.id)
    );
  }

  isChildActive(child: IdsWizardVisibleNode): boolean {
    return this.currentLeaf?.node.id === child.node.id;
  }

  childIcon(child: IdsWizardVisibleNode): string | undefined {
    return resolveStatusIcon(child.node, child.node.status ?? "none");
  }

  onGroupSelect(group: IdsWizardDisplayStep): void {
    const groupHasChildren = group.children.length > 0;
    this.goToLeaf(groupHasChildren ? group.children[0] : group.top);
  }

  goToLeaf(leaf: IdsWizardVisibleNode | undefined): void {
    if (!leaf) {
      return;
    }
    if (leaf.node.id === this.currentStepId) {
      return;
    }
    this.currentStepId = leaf.node.id;
    this.currentLeaf = leaf;
    this.notifyStepChange(leaf);
    this.cdr.markForCheck();
  }

  cancel(): void {
    if (this.currentPayload) {
      this.onCancel.emit(this.currentPayload);
    }
  }

  goPrevious(): void {
    if (this.currentIndex <= 0) {
      return;
    }
    const prev = this.leaves[this.currentIndex - 1];
    this.goToLeaf(prev);
    if (prev) {
      this.onPrevious.emit(payloadFromNode(prev));
    }
  }

  goNextOrFinish(): void {
    if (!this.currentLeaf || !this.currentPayload) {
      return;
    }
    const label = String(this.primaryLabel).toLowerCase();
    if (this.isLastLeaf || label === "finish") {
      this.onFinish.emit(this.currentPayload);
      return;
    }
    const next = this.leaves[this.currentIndex + 1];
    this.goToLeaf(next);
    if (next) {
      this.onNext.emit(payloadFromNode(next));
    }
  }

  private notifyStepChange(leaf: IdsWizardVisibleNode): void {
    const payload = payloadFromNode(leaf);
    const key = `${payload.stepId}|${payload.stepCode}`;
    if (this.lastStepChangeKey === key) {
      return;
    }
    this.lastStepChangeKey = key;
    this.onStepChange.emit(payload);
  }

  private syncCurrentLeaf(): void {
    const { display, leaves } = flattenVisible(this.steps ?? [], this.wizardCtx);
    this.display = display;
    this.leaves = leaves;

    if (leaves.length === 0) {
      this.currentStepId = undefined;
      this.currentLeaf = undefined;
      return;
    }

    const hasCurrent =
      this.currentStepId != null && leaves.some((leaf) => leaf.node.id === this.currentStepId);
    if (hasCurrent) {
      this.currentLeaf = leaves.find((leaf) => leaf.node.id === this.currentStepId);
      return;
    }

    const requested = this.initialStepId
      ? leaves.find((leaf) => leaf.node.id === this.initialStepId)
      : undefined;
    const nextLeaf = requested ?? leaves[0];
    this.currentStepId = nextLeaf.node.id;
    this.currentLeaf = nextLeaf;
    this.notifyStepChange(nextLeaf);
  }
}
