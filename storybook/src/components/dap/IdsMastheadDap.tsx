import { Popover } from "@base-ui-components/react/popover";
import { useMemo, useState } from "react";
import { AppLauncher, type AppLauncherOption, type AppLauncherProduct } from "../AppLauncher";
import { Icon } from "../Icon";
import styles from "./IdsMastheadDap.module.css";

export interface IdsMastheadDapProps {
  productName?: string;
  productAreaLabel?: string;
  userInitials?: string;
  helpItems?: string[];
  launcherProducts?: AppLauncherProduct[];
  launcherOptions?: AppLauncherOption[];
  onHelpSelect?: (label: string) => void;
  onLauncherProductSelect?: (productId: string) => void;
  onLauncherOptionSelect?: (optionId: string) => void;
}

function buildDefaultProducts(): AppLauncherProduct[] {
  return [
    { id: "p1", name: "Product Name 1" },
    { id: "p2", name: "Product Name 2" },
    { id: "p3", name: "Product Name 3" },
    { id: "p4", name: "Product Name 4" },
  ];
}

function buildDefaultOptions(): AppLauncherOption[] {
  return [
    { id: "o5", label: "Product Name 5" },
    { id: "o6", label: "Product Name 6" },
    { id: "o8", label: "Product Name 8" },
  ];
}

export function IdsMastheadDap({
  productName = "Dell Automation Platform",
  productAreaLabel = "Portal",
  userInitials = "DT",
  helpItems = ["Help", "What's New", "Get Started", "About"],
  launcherProducts,
  launcherOptions,
  onHelpSelect,
  onLauncherProductSelect,
  onLauncherOptionSelect,
}: IdsMastheadDapProps) {
  const [helpOpen, setHelpOpen] = useState(false);

  const products = useMemo(() => {
    const src = launcherProducts ?? buildDefaultProducts();
    return src.map((product) => ({
      ...product,
      onSelect: () => onLauncherProductSelect?.(product.id ?? product.name),
    }));
  }, [launcherProducts, onLauncherProductSelect]);

  const options = useMemo(() => {
    const src = launcherOptions ?? buildDefaultOptions();
    return src.map((option) => ({
      ...option,
      onSelect: () => onLauncherOptionSelect?.(option.id ?? option.label),
    }));
  }, [launcherOptions, onLauncherOptionSelect]);

  return (
    <header className={styles.root}>
      <div className={styles.productInfo}>
        <span className={styles.productName}>{productName}</span>
        <span className={styles.productDivider} aria-hidden="true" />
        <span className={styles.productArea}>{productAreaLabel}</span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.actionButton} aria-label="Settings">
          <Icon shapeName="setting-gear-16" className={styles.actionIcon} />
        </button>

        <Popover.Root open={helpOpen} onOpenChange={setHelpOpen}>
          <Popover.Trigger
            className={[styles.actionButton, helpOpen ? styles.actionButtonOpen : ""].filter(Boolean).join(" ")}
            aria-label="Help"
          >
            <Icon shapeName="help-circ-16" className={styles.actionIcon} />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={0} align="end">
              <Popover.Popup className={styles.helpMenu}>
                <ul className={styles.helpList}>
                  {helpItems.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className={styles.helpItem}
                        onClick={() => {
                          onHelpSelect?.(item);
                          setHelpOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        <div className={styles.launcherSlot}>
          <AppLauncher
            triggerVariant="masthead"
            sideOffset={0}
            products={products}
            options={options}
          />
        </div>

        <div className={styles.userInitials} aria-label={`User initials ${userInitials}`}>
          {userInitials}
        </div>
      </div>
    </header>
  );
}
