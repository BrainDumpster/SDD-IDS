import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LeftNavSecondaryContextMenu,
  type LeftNavSecondaryContextMenuOption,
} from "./LeftNavSecondaryContextMenu";
import {
  MainMenuLeftChildren,
  MainMenuLeftGroup,
  MainMenuLeftItem,
  MainMenuLeftItemIcon,
  MainMenuLeftLogoSlot,
} from "./MainMenuLeft.compose";
import { MainMenuLeftContext, type MainMenuLeftContextValue } from "./MainMenuLeftContext";
import styles from "./MainMenuLeft.module.css";
import { Icon } from "./Icon";
import type {
  MainMenuLeftContextMenuOption,
  MainMenuLeftLink,
  MainMenuLeftLogo,
  MainMenuLeftNavigationTarget,
  MainMenuLeftPrimaryItem,
  MainMenuLeftPrimaryState,
  MainMenuLeftProps,
  MainMenuLeftSecondaryContextMenuDetail,
  MainMenuLeftSecondaryItem,
  MainMenuLeftSelectionDetail,
} from "./MainMenuLeft.types";
import {
  buildNavigateTarget,
  buildSelectionDetail,
  primaryDisplayName,
  resolveInitialSelectedKey,
  resolvePrimaryId,
  resolveSecondaryId,
  secondaryDisplayName,
  toPascalState,
} from "./MainMenuLeft.utils";

export type {
  MainMenuLeftContextMenuOption,
  MainMenuLeftLink,
  MainMenuLeftLogo,
  MainMenuLeftNavigationTarget,
  MainMenuLeftPrimaryItem,
  MainMenuLeftPrimaryState,
  MainMenuLeftSecondaryContextMenuDetail,
  MainMenuLeftSecondaryItem,
  MainMenuLeftSelectionDetail,
};

export {
  MainMenuLeftChildren,
  MainMenuLeftGroup,
  MainMenuLeftItem,
  MainMenuLeftItemIcon,
  MainMenuLeftLogoSlot,
};

export interface MainMenuLeftRootProps extends Omit<MainMenuLeftProps, "items"> {
  items?: MainMenuLeftPrimaryItem[];
  children?: ReactNode;
}

export function MainMenuLeft({
  logo,
  expanded = true,
  onExpandedChange,
  items,
  children,
  defaultSelectedItemId,
  defaultExpandedChildrenItemId,
  defaultSelectedSecondaryItemId,
  forceStates = false,
  onNavigate,
  onSecondaryContextMenu,
  getSecondaryContextMenuOptions,
  onSelected,
  ariaLabel = "Main menu left",
  programme = "ids",
  menuLead,
}: MainMenuLeftRootProps) {
  const useComposition = items === undefined;
  const controlled = onExpandedChange !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(expanded);
  useEffect(() => {
    if (!controlled) setInternalExpanded(expanded);
  }, [expanded, controlled]);

  const railExpanded = controlled ? (expanded ?? true) : internalExpanded;

  const setRailExpanded = (next: boolean) => {
    if (!controlled) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  const [selectedKey, setSelectedKey] = useState<string | null>(() =>
    resolveInitialSelectedKey(items ?? [], defaultSelectedItemId),
  );
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(
    () => defaultExpandedChildrenItemId ?? null,
  );
  const [selectedSecondaryParentKey, setSelectedSecondaryParentKey] = useState<string | null>(
    () => defaultSelectedSecondaryItemId?.parentItemId ?? null,
  );
  const [selectedSecondaryKey, setSelectedSecondaryKey] = useState<string | null>(
    () => defaultSelectedSecondaryItemId?.childId ?? null,
  );

  const [groups, setGroups] = useState<
    Record<string, { defaultExpanded: boolean; childrenMenuPinned: boolean }>
  >({});

  const registerGroup = useCallback(
    (groupId: string, options: { defaultExpanded: boolean; childrenMenuPinned: boolean }) => {
      setGroups((prev) => {
        const existing = prev[groupId];
        if (
          existing &&
          existing.defaultExpanded === options.defaultExpanded &&
          existing.childrenMenuPinned === options.childrenMenuPinned
        ) {
          return prev;
        }
        return { ...prev, [groupId]: options };
      });
    },
    [],
  );

  const unregisterGroup = useCallback((groupId: string) => {
    setGroups((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
  }, []);

  const isGroupExpanded = useCallback(
    (groupId: string) => {
      const meta = groups[groupId];
      if (!meta) return false;
      if (meta.childrenMenuPinned) return meta.defaultExpanded;
      return expandedGroupId === groupId;
    },
    [expandedGroupId, groups],
  );

  const toggleGroup = useCallback(
    (groupId: string) => {
      if (!railExpanded) return;
      setExpandedGroupId((prev) => {
        const next = prev === groupId ? null : groupId;
        if (next === null) {
          setSelectedSecondaryParentKey(null);
          setSelectedSecondaryKey(null);
        }
        return next;
      });
    },
    [railExpanded],
  );

  const getPrimaryState = useCallback(
    (itemId: string, forced?: MainMenuLeftPrimaryState): MainMenuLeftPrimaryState => {
      if (forceStates && forced) return forced;
      return selectedKey === itemId ? "selected" : "default";
    },
    [forceStates, selectedKey],
  );

  const contextValue = useMemo<MainMenuLeftContextValue>(
    () => ({
      railExpanded,
      forceStates,
      defaultSelectedItemId,
      registerGroup,
      unregisterGroup,
      toggleGroup,
      isGroupExpanded,
      getPrimaryState,
      isPrimarySelected: (itemId, forced) => {
        const state = getPrimaryState(itemId, forced);
        return state === "selected" || state === "selected-focus";
      },
      isPrimaryFocused: (itemId, forced) => {
        const state = getPrimaryState(itemId, forced);
        return state === "default-focus" || state === "selected-focus";
      },
      showPrimaryInset: (itemId, groupId, forced) => {
        const state = getPrimaryState(itemId, forced);
        const hasForced = forceStates && Boolean(forced);
        const hasSelectedSecondary = groupId
          ? selectedSecondaryParentKey === groupId
          : false;
        if (hasForced) return state === "selected" || state === "selected-focus";
        if (groupId) return hasSelectedSecondary;
        return selectedKey === itemId;
      },
      hasSelectedSecondaryInGroup: (groupId) => selectedSecondaryParentKey === groupId,
      primaryAriaCurrent: (itemId, groupId, forced) => {
        const state = getPrimaryState(itemId, forced);
        const isLeafSelected = state === "selected" || state === "selected-focus";
        const hasSelectedSecondary = groupId
          ? selectedSecondaryParentKey === groupId
          : false;
        const childrenVisible = groupId
          ? railExpanded && isGroupExpanded(groupId)
          : false;
        if (
          (isLeafSelected && !hasSelectedSecondary) ||
          (hasSelectedSecondary && !childrenVisible)
        ) {
          return "page";
        }
        return undefined;
      },
      isSecondarySelected: (itemId, parentGroupId) =>
        selectedSecondaryParentKey === parentGroupId && selectedSecondaryKey === itemId,
      onPrimaryActivate: (itemId, label, groupId) => {
        if (groupId && railExpanded) return;
        setSelectedKey(itemId);
        onNavigate?.(buildNavigateTarget(itemId, label, undefined, undefined, {}));
        onSelected?.(
          buildSelectionDetail("primary", itemId, undefined, label, undefined, {}),
        );
        setSelectedSecondaryParentKey(null);
        setSelectedSecondaryKey(null);
      },
      onSecondaryActivate: (itemId, parentGroupId, label) => {
        setSelectedKey(null);
        setSelectedSecondaryParentKey(parentGroupId);
        setSelectedSecondaryKey(itemId);
        onNavigate?.(buildNavigateTarget(itemId, label, parentGroupId, undefined, {}));
        onSelected?.(
          buildSelectionDetail("secondary", itemId, parentGroupId, label, undefined, {}),
        );
      },
      showChevronForGroup: (groupId) => Boolean(groups[groupId]) && railExpanded,
      isGroupChildrenVisible: (groupId) => railExpanded && isGroupExpanded(groupId),
      primaryAriaExpanded: (groupId) =>
        groups[groupId] && railExpanded ? isGroupExpanded(groupId) : undefined,
    }),
    [
      railExpanded,
      forceStates,
      defaultSelectedItemId,
      registerGroup,
      unregisterGroup,
      toggleGroup,
      isGroupExpanded,
      getPrimaryState,
      selectedKey,
      selectedSecondaryParentKey,
      selectedSecondaryKey,
      groups,
      onNavigate,
      onSelected,
    ],
  );

  return (
    <MainMenuLeftContext.Provider value={contextValue}>
      <nav
        className={[
          styles.root,
          railExpanded ? styles.expanded : styles.collapsed,
          programme === "synapse" ? styles.programmeSynapse : "",
          programme === "synapse" && railExpanded ? styles.programmeSynapseExpanded : "",
          programme === "synapse" && !railExpanded ? styles.programmeSynapseCollapsed : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={ariaLabel}
      >
        {logo ? <MainMenuLeftLogoFromData logo={logo} onNavigate={onNavigate} /> : null}

        <div className={styles.content}>
          {menuLead && (railExpanded || programme === "synapse") ? (
            <MenuLeadBlock menuLead={menuLead} railExpanded={railExpanded} />
          ) : null}

          {useComposition ? (
            children
          ) : (
            <MainMenuLeftItemsAdapter
              items={items ?? []}
              railExpanded={railExpanded}
              forceStates={forceStates}
              selectedKey={selectedKey}
              expandedChildrenKey={expandedGroupId}
              selectedSecondaryParentKey={selectedSecondaryParentKey}
              selectedSecondaryKey={selectedSecondaryKey}
              programme={programme}
              onNavigate={onNavigate}
              onSelected={onSelected}
              onSecondaryContextMenu={onSecondaryContextMenu}
              getSecondaryContextMenuOptions={getSecondaryContextMenuOptions}
              setSelectedKey={setSelectedKey}
              setExpandedChildrenKey={setExpandedGroupId}
              setSelectedSecondaryParentKey={setSelectedSecondaryParentKey}
              setSelectedSecondaryKey={setSelectedSecondaryKey}
            />
          )}
        </div>

        <div className={styles.bottomToggle}>
          <button
            type="button"
            className={styles.bottomToggleButton}
            aria-label={railExpanded ? "Collapse navigation" : "Expand navigation"}
            onClick={() => {
              setRailExpanded(!railExpanded);
              setExpandedGroupId(null);
            }}
          >
            <Icon
              shapeName={railExpanded ? "double-chev-left" : "double-chev-right"}
              className={styles.bottomToggleIcon}
              style={{ width: 16, height: 16, flexShrink: 0 }}
            />
          </button>
        </div>
      </nav>
    </MainMenuLeftContext.Provider>
  );
}

function MainMenuLeftLogoFromData({
  logo,
  onNavigate,
}: {
  logo: MainMenuLeftLogo;
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
}) {
  if (logo.link) {
    return (
      <div className={styles.logoSlot}>
        <button
          type="button"
          className={styles.logoButton}
          title={logo.tooltip ?? logo.alt}
          aria-label={logo.alt}
          onClick={() =>
            onNavigate?.(buildNavigateTarget("__logo__", logo.alt, undefined, logo.link, {}))
          }
        >
          <LogoMark logo={logo} />
        </button>
      </div>
    );
  }
  return (
    <MainMenuLeftLogoSlot
      alt={logo.alt}
      src={logo.src}
      iconName={logo.iconName}
      tooltip={logo.tooltip}
    />
  );
}

function LogoMark({ logo }: { logo: MainMenuLeftLogo }) {
  if (logo.src) {
    return <img src={logo.src} alt="" className={styles.logoImg} width={32} height={32} />;
  }
  if (logo.iconName) {
    return <Icon shapeName={logo.iconName} className={styles.logoIcon} />;
  }
  return null;
}

function MenuLeadBlock({
  menuLead,
  railExpanded,
}: {
  menuLead: NonNullable<MainMenuLeftProps["menuLead"]>;
  railExpanded: boolean;
}) {
  return (
    <div
      className={[styles.menuLeadBlock, !railExpanded ? styles.menuLeadBlockCollapsed : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className={[
          styles.menuLeadButton,
          !railExpanded ? styles.menuLeadButtonCollapsed : "",
        ]
          .filter(Boolean)
          .join(" ")}
        title={menuLead.label ?? "New Chat"}
        aria-label={menuLead.label ?? "New Chat"}
        onClick={() => menuLead.onAction?.()}
      >
        <span className={styles.menuLeadIcon} aria-hidden="true">
          <Icon shapeName="shape-plus" style={{ width: 16, height: 16 }} />
        </span>
        {railExpanded ? (
          <span className={styles.menuLeadLabel}>{menuLead.label ?? "New Chat"}</span>
        ) : null}
      </button>
    </div>
  );
}

interface ItemsAdapterProps {
  items: MainMenuLeftPrimaryItem[];
  railExpanded: boolean;
  forceStates: boolean;
  selectedKey: string | null;
  expandedChildrenKey: string | null;
  selectedSecondaryParentKey: string | null;
  selectedSecondaryKey: string | null;
  programme: "ids" | "synapse";
  onNavigate?: MainMenuLeftProps["onNavigate"];
  onSelected?: MainMenuLeftProps["onSelected"];
  onSecondaryContextMenu?: MainMenuLeftProps["onSecondaryContextMenu"];
  getSecondaryContextMenuOptions?: MainMenuLeftProps["getSecondaryContextMenuOptions"];
  setSelectedKey: (key: string) => void;
  setExpandedChildrenKey: (key: string | null) => void;
  setSelectedSecondaryParentKey: (key: string | null) => void;
  setSelectedSecondaryKey: (key: string | null) => void;
}

function MainMenuLeftItemsAdapter({
  items,
  railExpanded,
  forceStates,
  selectedKey,
  expandedChildrenKey,
  selectedSecondaryParentKey,
  selectedSecondaryKey,
  programme,
  onNavigate,
  onSelected,
  onSecondaryContextMenu,
  getSecondaryContextMenuOptions,
  setSelectedKey,
  setExpandedChildrenKey,
  setSelectedSecondaryParentKey,
  setSelectedSecondaryKey,
}: ItemsAdapterProps) {
  return (
    <>
      {items.map((item, itemIndex) => {
        const itemId = resolvePrimaryId(item, itemIndex);
        const hasForcedState = forceStates && Boolean(item.state);
        const state = hasForcedState
          ? item.state!
          : selectedKey === itemId
            ? "selected"
            : "default";
        const isSelected = state === "selected" || state === "selected-focus";
        const isFocused = state === "default-focus" || state === "selected-focus";
        const childList = item.children ?? [];
        const hasChildren = childList.length > 0;
        const showChildrenList =
          railExpanded &&
          hasChildren &&
          (hasForcedState ? item.childrenMenu === "expanded" : expandedChildrenKey === itemId);
        const showChevron = railExpanded && hasChildren;
        const primaryIconName = item.iconName ?? "home";
        const hasSelectedSecondary = selectedSecondaryParentKey === itemId;
        const showSelectedInset = hasForcedState
          ? state === "selected" || state === "selected-focus"
          : hasChildren
            ? hasSelectedSecondary
            : selectedKey === itemId;
        const primaryIsCurrentPage =
          (isSelected && !hasSelectedSecondary) ||
          (hasSelectedSecondary && !showChildrenList);
        const primaryLabel = primaryDisplayName(item);
        const primaryTitle = item.tooltip ?? primaryLabel;
        const secondaryContextMenuEnabled =
          programme === "synapse" && Boolean(item.childrenContextMenu);

        return (
          <div key={itemId} className={styles.itemBlock}>
            <button
              type="button"
              title={primaryTitle}
              onClick={() => {
                if (hasForcedState) return;

                if (hasChildren && railExpanded) {
                  setExpandedChildrenKey(expandedChildrenKey === itemId ? null : itemId);
                  return;
                }

                setSelectedKey(itemId);
                onNavigate?.(
                  buildNavigateTarget(itemId, primaryLabel, undefined, item.link, {
                    href: item.href,
                    routeRef: item.routeRef,
                  }),
                );
                onSelected?.(
                  buildSelectionDetail("primary", itemId, undefined, primaryLabel, item.link, {
                    href: item.href,
                    routeRef: item.routeRef,
                  }),
                );
                setSelectedSecondaryParentKey(null);
                setSelectedSecondaryKey(null);
              }}
              className={[
                styles.primaryRow,
                !hasForcedState ? styles.interactive : "",
                styles[`state${toPascalState(state)}`],
                hasSelectedSecondary ? styles.secondaryParentSelected : "",
                showSelectedInset ? styles.selected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={primaryIsCurrentPage ? "page" : undefined}
              aria-expanded={showChevron ? showChildrenList : undefined}
              tabIndex={hasForcedState ? -1 : undefined}
            >
              <Icon shapeName={primaryIconName} className={styles.primaryIcon} />
              {railExpanded ? <span className={styles.primaryLabel}>{primaryLabel}</span> : null}
              {showChevron ? (
                <Icon
                  shapeName={showChildrenList ? "chev-down-thick" : "chev-right-thick"}
                  className={styles.chevronIcon}
                />
              ) : null}
              {isFocused ? <span className={styles.focusRing} aria-hidden="true" /> : null}
              {showSelectedInset ? (
                <span className={styles.selectedInset} aria-hidden="true" />
              ) : null}
            </button>

            {showChildrenList ? (
              <div className={styles.secondarySection}>
                {childList.map((child, childIndex) => {
                  const childId = resolveSecondaryId(child, itemId, childIndex);
                  const childLabel = secondaryDisplayName(child);
                  const isSecondarySelected =
                    selectedSecondaryParentKey === itemId && selectedSecondaryKey === childId;

                  const activateSecondary = () => {
                    setSelectedKey(null);
                    setSelectedSecondaryParentKey(itemId);
                    setSelectedSecondaryKey(childId);
                    onNavigate?.(
                      buildNavigateTarget(childId, childLabel, itemId, child.link, {
                        href: child.href,
                        routeRef: child.routeRef,
                      }),
                    );
                    onSelected?.(
                      buildSelectionDetail("secondary", childId, itemId, childLabel, child.link, {
                        href: child.href,
                        routeRef: child.routeRef,
                      }),
                    );
                  };

                  if (secondaryContextMenuEnabled) {
                    const contextMenuDetail: MainMenuLeftSecondaryContextMenuDetail = {
                      parentItemId: itemId,
                      childId,
                      name: childLabel,
                    };
                    const resolvedContextMenuOptions =
                      child.contextMenuOptions?.length
                        ? child.contextMenuOptions
                        : getSecondaryContextMenuOptions?.(contextMenuDetail) ?? [];

                    return (
                      <div
                        key={childId}
                        className={[
                          styles.secondaryRowWrap,
                          isSecondarySelected ? styles.secondaryRowSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <button
                          type="button"
                          title={child.tooltip ?? childLabel}
                          className={styles.secondaryRowLabel}
                          aria-current={isSecondarySelected ? "page" : undefined}
                          onClick={activateSecondary}
                        >
                          {childLabel}
                        </button>
                        {resolvedContextMenuOptions.length > 0 ? (
                          <LeftNavSecondaryContextMenu
                            childLabel={childLabel}
                            options={resolvedContextMenuOptions}
                            defaultOpen={child.contextMenuDefaultOpen}
                            onOpenChange={(nextOpen) => {
                              if (nextOpen) onSecondaryContextMenu?.(contextMenuDetail);
                            }}
                          />
                        ) : (
                          <button
                            type="button"
                            className={styles.secondaryContextButton}
                            title="More actions"
                            aria-label={`More actions for ${childLabel}`}
                            aria-haspopup="menu"
                            onClick={(event) => {
                              event.stopPropagation();
                              onSecondaryContextMenu?.(contextMenuDetail);
                            }}
                          >
                            <Icon
                              shapeName="overflow-menu-dots"
                              className={styles.secondaryContextIcon}
                              style={{ width: 16, height: 16 }}
                            />
                          </button>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={childId}
                      type="button"
                      title={child.tooltip ?? childLabel}
                      className={[
                        styles.secondaryRow,
                        styles.secondaryInteractive,
                        isSecondarySelected ? styles.secondaryRowSelected : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-current={isSecondarySelected ? "page" : undefined}
                      onClick={activateSecondary}
                    >
                      {childLabel}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export type MainMenuLeftProps = MainMenuLeftRootProps;
