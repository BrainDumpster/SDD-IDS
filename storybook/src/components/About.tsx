import { useState, type ReactNode } from "react";
import copyIcon from "../../../assets/icons/copy.svg";
import { Dialog } from "./Dialog";
import { Icon } from "./Icon";
import { Tabs, type TabItem } from "./Tabs";
import styles from "./About.module.css";

export interface AboutTabItem {
  id: string;
  label: string;
  panel?: ReactNode;
}

export interface AboutProps {
  programme?: "ids" | "synapse";
  /** Omit when `open` / `onOpenChange` control visibility from outside. */
  trigger?: ReactNode;
  productTitle: string;
  /** Optional — Body 2 line below product name (`var(--spacing-space-4)` gap). */
  versionLabel?: string;
  /** Figma `30680:10977` — optional product icon above title (IDS default). */
  showProductIcon?: boolean;
  /** Icon slug from `assets/icons/<slug>.svg`; preferred for IDS (tinted via `var(--color-icon-brand-base)`). */
  productIconSlug?: string;
  /** Optional full-color product icon URL (e.g. imported SVG). Used when `productIconSlug` is omitted. */
  productIconSrc?: string;
  /** Figma `30680:10947` — MODAL-TAB-BAR using IDS Tab (`components/ids/tab/design-spec.md`, primary). */
  showTabs?: boolean;
  /** Extra tabs after the default **About** tab (Figma sample: Tab Option 1–3). */
  additionalTabs?: AboutTabItem[];
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
  programme = "synapse",
  trigger,
  productTitle,
  versionLabel,
  showProductIcon = false,
  productIconSlug,
  productIconSrc,
  showTabs = false,
  additionalTabs = [],
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

  const showBrandCluster = Boolean(
    logoSrc || resolvedCopyrightText || resolvedCopyrightContent != null
  );

  const contentClassName =
    programme === "ids"
      ? `${styles.contentColumn} ${styles.contentColumnIds}`
      : styles.contentColumn;

  const productIcon =
    showProductIcon && productIconSlug ? (
      <Icon
        shapeName={productIconSlug}
        color="var(--color-icon-brand-base)"
        className={styles.productIcon}
        style={{ width: 104, height: 104 }}
      />
    ) : showProductIcon && productIconSrc ? (
      <img
        src={productIconSrc}
        alt=""
        className={styles.productIcon}
        aria-hidden="true"
      />
    ) : null;

  const versionClassName =
    programme === "ids"
      ? `${styles.versionLine} ${styles.versionLineIds}`
      : styles.versionLine;

  const productTitleEl = (
    <h2
      className={[
        styles.aboutPanelTitle,
        programme === "ids" ? styles.aboutPanelTitleIds : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {productTitle}
    </h2>
  );

  const versionSerialBlock = (
    <>
      {versionLabel ? (
        <p className={versionClassName}>{versionLabel}</p>
      ) : null}
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
    </>
  );

  const logoEl = logoSrc ? (
    <img
      src={logoSrc}
      alt=""
      className={styles.logo}
      height={32}
      aria-hidden="true"
    />
  ) : null;

  const copyrightEl =
    resolvedCopyrightText || resolvedCopyrightContent != null ? (
      <CopyrightBlock
        copyrightContent={resolvedCopyrightContent}
        copyrightText={resolvedCopyrightText}
      />
    ) : null;

  const copyrightCluster = showBrandCluster ? (
    <div
      className={[
        styles.brandBlock,
        programme === "ids" ? styles.brandBlockIds : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {logoEl}
      {copyrightEl}
    </div>
  ) : null;

  const defaultPanelBody = (
    <div className={contentClassName}>
      {versionSerialBlock}
      {copyrightCluster}
    </div>
  );

  const aboutTabDefaultPanel = (
    <div className={styles.aboutTabFrameCenter}>
      <div className={styles.aboutElementContent}>
        <div className={styles.centerArea}>
          <div className={styles.productBlock}>
            {productIcon}
            <div className={styles.productMeta}>
              {productTitleEl}
              {versionSerialBlock}
            </div>
          </div>
          {showBrandCluster ? (
            <div className={styles.copyrightBlock}>
              {logoEl}
              {copyrightEl}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  const tabItems: TabItem[] = [
    {
      id: "about",
      label: "About",
      panel: aboutTabDefaultPanel,
    },
    ...additionalTabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      panel: tab.panel ?? (
        <div className={styles.aboutTabFrameCenter}>
          <div className={styles.aboutTabPlaceholder}>
            {tab.label} content area.
          </div>
        </div>
      ),
    })),
  ];

  const [activeTabId, setActiveTabId] = useState("about");

  const tabList = showTabs ? (
    <Tabs
      items={tabItems}
      variant="primary"
      surface="elevated"
      layout="embedded"
      programme={programme}
      activeTabId={activeTabId}
      onActiveTabChange={setActiveTabId}
      renderPanel={false}
    />
  ) : null;

  const tabPanel = showTabs ? (
    <Tabs
      items={tabItems}
      variant="primary"
      surface="elevated"
      layout="embedded"
      programme={programme}
      activeTabId={activeTabId}
      onActiveTabChange={setActiveTabId}
      renderList={false}
      className={styles.aboutTabsPanelHost}
    />
  ) : null;

  return (
    <Dialog
      programme={programme}
      variant="about"
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      openDidalog={defaultOpen}
      dialogTitle={productTitle}
      dialogType="None"
      dialogClosable
      primaryButtonName={closeLabel}
      enableTertiaryButtton={false}
      tertiaryButtonName={undefined}
      aboutUseTabs={showTabs}
      aboutTabList={tabList}
      aboutTabPanel={tabPanel}
      aboutLeadingContent={showTabs ? undefined : productIcon}
    >
      {showTabs ? null : defaultPanelBody}
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
