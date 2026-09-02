import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import {
  TAG_DEMO_HOVER_DEFAULT,
  TAG_SPEC_ACCURATE_DEFAULTS,
  type TagSize,
  type TagTone,
  type TagType,
} from "@component-contracts/ids/tag.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";

function normalizeLabelPrefix(value: string): string {
  return value.replace(/:+\s*$/, "");
}

function toneToCssClass(tone: TagTone): string {
  if (tone === "none") return "none";
  if (tone === "informational") return "informational";
  return tone;
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
  @Input() disabled = TAG_SPEC_ACCURATE_DEFAULTS.disabled;
  @Input() error = TAG_SPEC_ACCURATE_DEFAULTS.error;
  @Input() focusVisible = TAG_SPEC_ACCURATE_DEFAULTS.focusVisible;
  @Input() focusOnText = TAG_SPEC_ACCURATE_DEFAULTS.focusOnText;
  @Input() demoHover = TAG_DEMO_HOVER_DEFAULT;
  @Input() showLabel = TAG_SPEC_ACCURATE_DEFAULTS.showLabel;
  @Input() labelPrefix = TAG_SPEC_ACCURATE_DEFAULTS.labelPrefix;
  @Input() badgeValue?: string | number = TAG_SPEC_ACCURATE_DEFAULTS.badgeValue;
  @Input() leadingIconSlug: string | null = TAG_SPEC_ACCURATE_DEFAULTS.leadingIconSlug;
  @Input() closeIconSlug = TAG_SPEC_ACCURATE_DEFAULTS.closeIconSlug;

  @Output() readonly selectionChange = new EventEmitter<boolean>();
  @Output() readonly dismiss = new EventEmitter<void>();
  @Output() readonly tagClick = new EventEmitter<void>();

  @ViewChild("editableField") editableField?: ElementRef<HTMLSpanElement>;

  private internalSelected: boolean = TAG_SPEC_ACCURATE_DEFAULTS.selected;

  get isSelected(): boolean {
    return this.selected ?? this.internalSelected;
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
    return this.type === "badge" && this.badgeValue != null;
  }

  get isClickable(): boolean {
    return this.type === "clickable" && !this.disabled;
  }

  get isEditableFocusable(): boolean {
    return this.type === "editable" && !this.disabled;
  }

  get resolvedTone(): TagTone {
    return this.type === "read-only" ? this.tone : "none";
  }

  get toneClass(): string {
    return `tone-${toneToCssClass(this.resolvedTone)}`;
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
      this.selectionChange.emit(next);
      this.tagClick.emit();
      return;
    }
    if (this.isEditableFocusable) {
      this.editableField?.nativeElement.focus();
    }
  }

  onDismissClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.dismiss.emit();
  }
}
