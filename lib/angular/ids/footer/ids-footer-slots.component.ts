import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";

async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard unavailable");
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

@Component({
  selector: "ids-footer-left-region",
  standalone: true,
  template: `<div class="ids-footer__left"><ng-content /></div>`,
  styles: [":host { display: contents; }"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsFooterLeftRegionComponent {}

@Component({
  selector: "ids-footer-host-name",
  standalone: true,
  template: `
    <div class="ids-footer__field ids-footer__field--host">
      <span class="ids-footer__label">Host Name:</span>
      <span class="ids-footer__value" [attr.title]="hostTitle">{{ displayHostname }}</span>
    </div>
  `,
  styles: [":host { display: contents; }"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsFooterHostNameComponent {
  @Input() hostname = "";

  get displayHostname(): string {
    if (this.hostname.length <= 48) {
      return this.hostname;
    }
    return `${this.hostname.slice(0, 45)}...`;
  }

  get hostTitle(): string | null {
    return this.hostname.length > 48 ? this.hostname : null;
  }
}

@Component({
  selector: "ids-footer-swid-group",
  standalone: true,
  imports: [IdsIconComponent],
  template: `
    <div class="ids-footer__swid-group">
      <div class="ids-footer__field">
        <span class="ids-footer__label">SWID:</span>
        <span class="ids-footer__value">{{ swid }}</span>
      </div>
      <button
        type="button"
        class="ids-footer__copy-button"
        aria-label="Copy SWID"
        [disabled]="!canCopy"
        [attr.aria-disabled]="!canCopy ? 'true' : null"
        (click)="onCopyClick()"
      >
        <ids-icon className="ids-footer__copy-icon" shape="copy" variant="mask" [size]="14" />
      </button>
    </div>
  `,
  styles: [":host { display: contents; }"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsFooterSwidGroupComponent {
  @Input() swid = "";
  @Input() copyDisabled = false;

  @Output() readonly copySwid = new EventEmitter<string>();

  get canCopy(): boolean {
    return Boolean(this.swid) && !this.copyDisabled;
  }

  async onCopyClick(): Promise<void> {
    if (!this.canCopy || !this.swid) {
      return;
    }

    try {
      await copyTextToClipboard(this.swid);
    } catch {
      /* host handles non-blocking confirmation and errors */
    }

    this.copySwid.emit(this.swid);
  }
}

@Component({
  selector: "ids-footer-time-group",
  standalone: true,
  imports: [IdsIconComponent],
  template: `
    <div class="ids-footer__time-group">
      <ids-icon className="ids-footer__time-icon" shape="time-clock" variant="mask" [size]="16" />
      <span class="ids-footer__datetime">{{ currentDateTime }}</span>
    </div>
  `,
  styles: [":host { display: contents; }"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsFooterTimeGroupComponent {
  @Input() currentDateTime = "";
}

@Component({
  selector: "ids-footer-time-zone-group",
  standalone: true,
  imports: [IdsIconComponent],
  template: `
    <div class="ids-footer__timezone-group">
      <button
        type="button"
        class="ids-footer__timezone-button"
        [attr.aria-label]="resolvedAriaLabel"
        [disabled]="disabled"
        (click)="onTimeZoneButtonClick()"
      >
        <ids-icon
          className="ids-footer__globe-icon"
          shape="world-globe"
          variant="mask"
          [size]="16"
        />
        <span class="ids-footer__timezone-label">{{ resolvedTimeZoneLabel }}</span>
      </button>
    </div>
  `,
  styles: [":host { display: contents; }"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdsFooterTimeZoneGroupComponent {
  @Input() timeZoneLabel = "";
  @Input() disabled = false;
  @Input() ariaLabel?: string;

  @Output() readonly timeZoneClick = new EventEmitter<void>();

  get resolvedTimeZoneLabel(): string {
    return this.timeZoneLabel || "Time zone";
  }

  get resolvedAriaLabel(): string {
    return this.ariaLabel || this.resolvedTimeZoneLabel;
  }

  onTimeZoneButtonClick(): void {
    if (this.disabled) {
      return;
    }
    this.timeZoneClick.emit();
  }
}
