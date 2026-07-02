import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { NgClass } from "@angular/common";
import {
  TAG_SPEC_ACCURATE_DEFAULTS,
  type TagSize,
  type TagTone,
  type TagType,
  type TagVisualState,
} from "@component-contracts/ids/tag.contract";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";

function normalizeLabelPrefix(value: string): string {
  return value.replace(/:+\s*$/, "");
}

@Component({
  selector: "ids-tag",
  standalone: true,
  imports: [NgClass, IdsIconComponent],
  templateUrl: "./ids-tag.component.html",
  styleUrl: "./ids-tag.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsTagComponent {
  @Input() label = TAG_SPEC_ACCURATE_DEFAULTS.label;
  @Input() tone: TagTone = TAG_SPEC_ACCURATE_DEFAULTS.tone;
  @Input() type: TagType = TAG_SPEC_ACCURATE_DEFAULTS.type;
  @Input() size: TagSize = TAG_SPEC_ACCURATE_DEFAULTS.size;
  @Input() selected: boolean | undefined = TAG_SPEC_ACCURATE_DEFAULTS.selected;
  @Input() showLabel = TAG_SPEC_ACCURATE_DEFAULTS.showLabel;
  @Input() labelPrefix = TAG_SPEC_ACCURATE_DEFAULTS.labelPrefix;
  @Input() closable = TAG_SPEC_ACCURATE_DEFAULTS.closable;
  @Input() badgeCount?: number = TAG_SPEC_ACCURATE_DEFAULTS.badgeCount;
  @Input() visualState: TagVisualState = TAG_SPEC_ACCURATE_DEFAULTS.visualState;

  @Output() readonly selectedChange = new EventEmitter<boolean>();
  @Output() readonly dismissed = new EventEmitter<void>();
  @Output() readonly tagClick = new EventEmitter<void>();

  @ViewChild("editableField") editableField?: ElementRef<HTMLSpanElement>;

  private internalSelected: boolean = TAG_SPEC_ACCURATE_DEFAULTS.selected;

  get isSelected(): boolean {
    return this.selected ?? this.internalSelected;
  }

  get disabled(): boolean {
    return this.visualState === "disabled";
  }

  get prefixText(): string {
    return normalizeLabelPrefix(this.labelPrefix);
  }

  get resolvedSize(): TagSize {
    if (this.type === "read-only") {
      return this.size;
    }
    return this.size === "small" ? "large" : this.size;
  }

  get hasBadge(): boolean {
    return this.type === "badge" && this.badgeCount != null;
  }

  get showDismiss(): boolean {
    return this.closable || this.type === "editable";
  }

  get isClickable(): boolean {
    return this.type === "clickable" && !this.disabled;
  }

  get isEditableFocusable(): boolean {
    return this.type === "editable" && !this.disabled;
  }

  get toneClass(): string {
    return `tone-${this.tone}`;
  }

  get typeClass(): string {
    switch (this.type) {
      case "clickable":
        return "clickable";
      case "editable":
        return "editable";
      case "badge":
        return "type-badge";
      default:
        return "read-only";
    }
  }

  onRootClick(): void {
    if (this.isClickable) {
      const next = !this.isSelected;
      if (this.selected === undefined) {
        this.internalSelected = next;
      }
      this.selectedChange.emit(next);
      this.tagClick.emit();
      return;
    }
    if (this.isEditableFocusable) {
      this.editableField?.nativeElement.focus();
    }
  }

  onEditableMouseDown(event: MouseEvent): void {
    if (!this.isEditableFocusable) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }
    event.preventDefault();
    this.editableField?.nativeElement.focus();
  }

  onDismiss(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.dismissed.emit();
  }
}
