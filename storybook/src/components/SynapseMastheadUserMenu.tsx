import { Menu } from "@base-ui-components/react/menu";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "./Icon";
import dropdownStyles from "./DropdownMenu.module.css";
import mastheadStyles from "./SynapseMasthead.module.css";
import userMenuStyles from "./SynapseMastheadUserMenu.module.css";

/** Fixed menu width for masthead user panel (Figma `49989:83672`). */
const USER_MENU_WIDTH_PX = 250;

const userMenuPopupStyle = {
  width: `${USER_MENU_WIDTH_PX}px`,
  minWidth: `${USER_MENU_WIDTH_PX}px`,
  maxWidth: `${USER_MENU_WIDTH_PX}px`,
  "--dropdown-trigger-width": `${USER_MENU_WIDTH_PX}px`,
} as CSSProperties;

export interface SynapseMastheadUserMenuOption {
  id?: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface SynapseMastheadUserMenuProps {
  /** Display name shown in menu header (Figma `<User Name>` row). */
  userName: string;
  /** Email shown in highlighted info row. */
  email: string;
  /** Avatar initials when no icon/photo. */
  initials?: string;
  /** 16×16 user icon fallback. */
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  /** Additional selectable rows between email and Log Out. */
  options?: SynapseMastheadUserMenuOption[];
  /** Log Out action; omit to hide logout row. */
  onLogout?: () => void;
  logoutLabel?: string;
  /** Menu offset from avatar trigger (px). Masthead: `0` or `1`. */
  sideOffset?: number;
  /**
   * When true, email row uses brand-lighter + brand-neutral borders (Figma `49989:83672`).
   * When false, plain component row (Figma `50024:244160`, icon-only avatar).
   * Default: `true` if `initials` or `imageSrc` is set; otherwise `false`.
   */
  highlightEmailRow?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SynapseMastheadUserMenu({
  userName,
  email,
  initials,
  icon,
  imageSrc,
  imageAlt = "User avatar",
  options = [],
  onLogout,
  logoutLabel = "Log Out",
  sideOffset = 0,
  highlightEmailRow,
  onOpenChange,
}: SynapseMastheadUserMenuProps) {
  const [open, setOpen] = useState(false);

  const hasInitials = Boolean(initials?.trim());
  const hasPhoto = Boolean(imageSrc);
  const showHighlightedEmail = highlightEmailRow ?? (hasInitials || hasPhoto);

  const triggerLabel = hasInitials
    ? `User menu, ${initials}`
    : hasPhoto
      ? `User menu, ${imageAlt}`
      : "User menu";

  const avatarContent = hasPhoto ? (
    <img className={mastheadStyles.avatarImage} src={imageSrc} alt={imageAlt} />
  ) : hasInitials ? (
    initials
  ) : (
    <span className={userMenuStyles.avatarIcon}>
      {icon ?? <SynapseMastheadUserMenuDefaultIcon />}
    </span>
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const closeMenu = () => handleOpenChange(false);

  return (
    <Menu.Root open={open} onOpenChange={handleOpenChange}>
      <Menu.Trigger className={mastheadStyles.avatarAction} aria-label={triggerLabel}>
        <span className={mastheadStyles.avatarChip}>{avatarContent}</span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          side="bottom"
          align="end"
          sideOffset={Math.max(sideOffset, 0)}
        >
          <Menu.Popup
            className={userMenuStyles.popup}
            style={userMenuPopupStyle}
          >
            <div className={userMenuStyles.userNameRow} role="presentation">
              {userName}
            </div>
            <div
              className={
                showHighlightedEmail
                  ? userMenuStyles.emailRowHighlighted
                  : userMenuStyles.emailRowPlain
              }
              role="presentation"
            >
              {email}
            </div>
            {options.length > 0 ? (
              <div className={userMenuStyles.optionsScrollRegion}>
                {options.map((opt, index) => (
                  <Menu.Item
                    key={opt.id ?? index}
                    className={[dropdownStyles.item, userMenuStyles.optionItem].join(" ")}
                    disabled={opt.disabled}
                    data-selectable="false"
                    onClick={() => {
                      opt.onSelect?.();
                      closeMenu();
                    }}
                  >
                    {opt.label}
                  </Menu.Item>
                ))}
              </div>
            ) : null}
            {onLogout ? (
              <button
                type="button"
                className={userMenuStyles.footerAction}
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
              >
                {logoutLabel}
              </button>
            ) : null}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

/** Default user icon for masthead avatar menu when no initials/photo. */
export function SynapseMastheadUserMenuDefaultIcon() {
  return <Icon shapeName="user-single-16" style={{ width: 16, height: 16 }} />;
}
