import React, { useState } from "react";
import "./AppLauncher.css";

export interface AppLauncherProduct {
  id: string;
  name: string;
  iconSlug?: string;
  href?: string;
  onSelect?: (product: AppLauncherProduct) => void;
}

export interface AppLauncherOption {
  id: string;
  label: string;
  onSelect?: (option: AppLauncherOption) => void;
}

export interface AppLauncherFooterAction {
  label: string;
  onClick: () => void;
}

export interface AppLauncherProps {
  products?: AppLauncherProduct[];
  apps?: AppLauncherProduct[];
  options?: AppLauncherOption[];
  footerAction?: AppLauncherFooterAction;
  columns?: number;
  triggerVariant?: "default" | "masthead";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onProductSelect?: (payload: { id: string; name: string }) => void;
  onOptionSelect?: (payload: { id: string; label: string }) => void;
}

const AppLauncher: React.FC<AppLauncherProps> = ({
  products,
  apps,
  options = [],
  footerAction,
  columns = 2,
  triggerVariant = "default",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onProductSelect,
  onOptionSelect,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const productList = products || apps || [];

  const handleToggle = () => {
    const newOpen = !open;
    setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleProductClick = (product: AppLauncherProduct) => {
    onProductSelect?.({ id: product.id, name: product.name });
    product.onSelect?.(product);
    setInternalOpen(false);
  };

  const handleOptionClick = (option: AppLauncherOption) => {
    onOptionSelect?.({ id: option.id, label: option.label });
    option.onSelect?.(option);
    setInternalOpen(false);
  };

  const handleFooterAction = () => {
    footerAction?.onClick();
    setInternalOpen(false);
  };

  const defaultIcon = "shield-encrypt-alt";

  return (
    <div className="app-launcher">
      <button
        className={`app-launcher__trigger app-launcher__trigger--${triggerVariant}`}
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="true"
        type="button"
      >
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3H14M2 8H14M2 13H14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="app-launcher__surface">
          {productList.length > 0 && (
            <div className="app-launcher__product-region">
              {Array.from({ length: Math.ceil(productList.length / columns) }).map((_, rowIndex) => (
                <div key={rowIndex} className="app-launcher__product-row">
                  {productList
                    .slice(rowIndex * columns, (rowIndex + 1) * columns)
                    .map((product, colIndex) => (
                      <React.Fragment key={product.id}>
                        <button
                          className="app-launcher__product-tile"
                          onClick={() => handleProductClick(product)}
                          type="button"
                        >
                          <div className="app-launcher__product-icon">
                            <img
                              src={`/assets/icons/${product.iconSlug || defaultIcon}.svg`}
                              alt=""
                              width={32}
                              height={32}
                            />
                          </div>
                          <span className="app-launcher__product-label">{product.name}</span>
                        </button>
                        {colIndex < columns - 1 && rowIndex * columns + colIndex < productList.length - 1 && (
                          <div className="app-launcher__divider app-launcher__divider--vertical" />
                        )}
                      </React.Fragment>
                    ))}
                </div>
              ))}
              {Math.ceil(productList.length / columns) > 1 && (
                <div className="app-launcher__divider app-launcher__divider--horizontal" />
              )}
            </div>
          )}

          {options.length > 0 && (
            <div className="app-launcher__options-region">
              {options.map((option) => (
                <button
                  key={option.id}
                  className="app-launcher__option-row"
                  onClick={() => handleOptionClick(option)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {footerAction && (
            <div className="app-launcher__footer">
              <button
                className="app-launcher__footer-action"
                onClick={handleFooterAction}
                type="button"
              >
                {footerAction.label}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppLauncher;
