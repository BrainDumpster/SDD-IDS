import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {
  FOOTER_SPEC_ACCURATE_DEFAULTS,
} from "@component-contracts/ids/footer.contract";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";

async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
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
  selector: "ids-footer",
  standalone: true,
  imports: [IdsIconComponent],
  templateUrl: "./ids-footer.component.html",
  styleUrl: "./ids-footer.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ids-footer-host",
  },
})
export class IdsFooterComponent {
  @Input() hostname: string = FOOTER_SPEC_ACCURATE_DEFAULTS.hostname;
  @Input() swid: string = FOOTER_SPEC_ACCURATE_DEFAULTS.swid;
  @Input() currentDateTime: string = FOOTER_SPEC_ACCURATE_DEFAULTS.currentDateTime;
  @Input() timeZoneLabel: string = FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneLabel;
  @Input() showHostname = FOOTER_SPEC_ACCURATE_DEFAULTS.showHostname;
  @Input() showCurrentDateAndTime = FOOTER_SPEC_ACCURATE_DEFAULTS.showCurrentDateAndTime;
  @Input() showTimeZone = FOOTER_SPEC_ACCURATE_DEFAULTS.showTimeZone;
  @Input() copyDisabled = FOOTER_SPEC_ACCURATE_DEFAULTS.copyDisabled;
  @Input() timeZoneDisabled = FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneDisabled;

  @Output() readonly copySwid = new EventEmitter<string>();
  @Output() readonly timeZoneClick = new EventEmitter<void>();

  get canCopy(): boolean {
    return Boolean(this.swid) && !this.copyDisabled;
  }

  get resolvedTimeZoneLabel(): string {
    return this.timeZoneLabel || "Time zone";
  }

  get showSwidGroup(): boolean {
    return this.swid != null && this.swid !== "";
  }

  get showTimeGroup(): boolean {
    return (
      this.showCurrentDateAndTime &&
      this.currentDateTime != null &&
      this.currentDateTime !== ""
    );
  }

  async onCopyClick(): Promise<void> {
    if (!this.canCopy || !this.swid) {
      return;
    }
    try {
      await copyTextToClipboard(this.swid);
    } catch {
      /* host may surface errors via copySwid */
    }
    this.copySwid.emit(this.swid);
  }

  onTimeZoneButtonClick(): void {
    if (this.timeZoneDisabled) {
      return;
    }
    this.timeZoneClick.emit();
  }
}
