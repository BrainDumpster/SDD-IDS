import type { ReactNode } from "react";
import copyIcon from "../../../assets/icons/copy.svg";
import { Dialog } from "./Dialog";
import styles from "./About.module.css";

export interface AboutProps {
  /** Programme chrome — `ids` (square corners, default) or `synapse` (16px radius). */
  programme?: "ids" | "synapse";
  /** Omit when `open` / `onOpenChange` control visibility from outside. */
  trigger?: ReactNode;
  productTitle: string;
  /** Product brand logo (Figma shield) shown above the product name. */
  productLogoSrc?: string;
  productLogo?: ReactNode;
  /** Optional tab row rendered in the header (Figma `Tabs=True`). */
  tabs?: ReactNode;
  versionLabel: string;
  /** Figma `49962:52727` — optional serial row with copy affordance. */
  showSerialNumber?: boolean;
  serialNumber?: string;
  onSerialCopy?: () => void;
  /** Optional logo URL (e.g. imported SVG). */
  logoSrc?: string;
  /** Copyright / legal copy — rendered as **one** centered paragraph. Ignored if `copyrightContent` / `legalContent` is set. */
  copyrightText?: string;
  copyrightContent?: ReactNode;
  /** Alias of `copyrightText` (design-spec naming). */
  legalText?: string;
  /** Alias of `copyrightContent` (design-spec naming). */
  legalContent?: ReactNode;
  closeLabel?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function About({
  programme = "ids",
  trigger,
  productTitle,
  productLogoSrc,
  productLogo,
  tabs,
  versionLabel,
  showSerialNumber = false,
  serialNumber,
  onSerialCopy,
  logoSrc,
  copyrightText,
  copyrightContent,
  legalText,
  legalContent,
  closeLabel = "Close",
  defaultOpen = false,
  open,
  onOpenChange,
}: AboutProps) {
  const controlled = open !== undefined;
  if (!controlled && trigger == null) {
    throw new Error("About: pass `trigger`, or use controlled mode with `open` / `onOpenChange`.");
  }

  const resolvedCopyrightText = copyrightText ?? legalText;
  const resolvedCopyrightContent = copyrightContent ?? legalContent;

  const resolvedProductLogo =
    productLogo ?? (productLogoSrc ? <img src={productLogoSrc} alt="" /> : null);

  const showBrandCluster = Boolean(
    logoSrc || resolvedCopyrightText || resolvedCopyrightContent != null
  );

  return (
    <Dialog
      programme={programme}
      variant="about"
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      openDidalog={defaultOpen}
      dialogTitle={productTitle}
      aboutLogo={resolvedProductLogo}
      tabs={tabs}
      dialogType="None"
      dialogClosable
      primaryButtonName={closeLabel}
      enableTertiaryButtton={false}
      tertiaryButtonName={undefined}
    >
      <div className={styles.contentColumn}>
        <p className={styles.versionLine}>{versionLabel}</p>
        {showSerialNumber && serialNumber ? (
          <div className={styles.serialRow}>
            <span className={styles.serialLabel}>Serial Number: {serialNumber}</span>
            <button
              type="button"
              className={styles.serialCopy}
              aria-label={`Copy serial number ${serialNumber}`}
              onClick={() => {
                void navigator.clipboard?.writeText(serialNumber);
                onSerialCopy?.();
              }}
            >
              <img src={copyIcon} alt="" className={styles.serialCopyIcon} />
            </button>
          </div>
        ) : null}
        {showBrandCluster ? (
          <div className={styles.brandBlock}>
            {logoSrc ? (
              <img
                src={logoSrc}
                alt=""
                className={styles.logo}
                height={32}
                aria-hidden="true"
              />
            ) : null}
            {(resolvedCopyrightText || resolvedCopyrightContent != null) && (
              <CopyrightBlock
                copyrightContent={resolvedCopyrightContent}
                copyrightText={resolvedCopyrightText}
              />
            )}
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}

function normalizeCopyrightParagraph(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function CopyrightBlock({
  copyrightContent,
  copyrightText,
}: {
  copyrightContent?: ReactNode;
  copyrightText?: string;
}) {
  if (copyrightContent != null) {
    return <div className={styles.copyright}>{copyrightContent}</div>;
  }
  if (!copyrightText) return null;
  return (
    <p className={styles.copyright}>{normalizeCopyrightParagraph(copyrightText)}</p>
  );
}
