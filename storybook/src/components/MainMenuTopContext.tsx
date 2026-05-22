import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MainMenuTopLink, MainMenuTopSelectDetail } from "./MainMenuTop.types";

export interface MainMenuTopContextValue {
  size: "Large" | "Small";
  selectedId?: string;
  openMenuId: string | null;
  selectedOptionByItemId: Record<string, string>;
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  /** Opens dropdown for `id` and clears any other top selection (single active item). */
  openTopMenu: (id: string) => void;
  /** Closes dropdown for `id` and clears its transient selection. */
  closeTopMenu: (id: string) => void;
  selectNavItem: (id: string, name: string, link?: MainMenuTopLink, menuOptionId?: string) => void;
  clearNavItemSelection: (id: string) => void;
  setSelectedOption: (navItemId: string, optionId: string) => void;
  onMenuItemSelect?: (detail: MainMenuTopSelectDetail) => void;
}

const MainMenuTopContext = createContext<MainMenuTopContextValue | null>(null);

export function useMainMenuTopContext(): MainMenuTopContextValue {
  const ctx = useContext(MainMenuTopContext);
  if (!ctx) {
    throw new Error("MainMenuTop compound components must be used inside <MainMenuTop>.");
  }
  return ctx;
}

export interface MainMenuTopProviderProps {
  children: ReactNode;
  size?: "Large" | "Small";
  selectedId?: string;
  defaultSelectedId?: string;
  onMenuItemSelect?: (detail: MainMenuTopSelectDetail) => void;
}

export function MainMenuTopProvider({
  children,
  size = "Large",
  selectedId: selectedIdProp,
  defaultSelectedId,
  onMenuItemSelect,
}: MainMenuTopProviderProps) {
  const [selectedIdInternal, setSelectedIdInternal] = useState<string | undefined>(
    defaultSelectedId,
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [selectedOptionByItemId, setSelectedOptionByItemId] = useState<
    Record<string, string>
  >({});

  const selectedId = selectedIdProp ?? selectedIdInternal;

  const openTopMenu = useCallback(
    (id: string) => {
      setOpenMenuId(id);
      if (selectedIdProp === undefined) {
        setSelectedIdInternal(undefined);
      }
    },
    [selectedIdProp],
  );

  const closeTopMenu = useCallback(
    (id: string) => {
      setOpenMenuId((prev) => (prev === id ? null : prev));
      if (selectedIdProp === undefined) {
        setSelectedIdInternal((prev) => (prev === id ? undefined : prev));
      }
      setSelectedOptionByItemId((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [selectedIdProp],
  );

  const selectNavItem = useCallback(
    (id: string, name: string, link?: MainMenuTopLink, menuOptionId?: string) => {
      setOpenMenuId(null);
      if (selectedIdProp === undefined) setSelectedIdInternal(id);
      setSelectedOptionByItemId(menuOptionId ? { [id]: menuOptionId } : {});
      onMenuItemSelect?.({ id, name, selected: true, link, menuOptionId });
    },
    [onMenuItemSelect, selectedIdProp],
  );

  const setSelectedOption = useCallback((navItemId: string, optionId: string) => {
    setSelectedOptionByItemId((prev) => ({ ...prev, [navItemId]: optionId }));
  }, []);

  const clearNavItemSelection = useCallback(
    (id: string) => {
      if (selectedIdProp === undefined) {
        setSelectedIdInternal((prev) => (prev === id ? undefined : prev));
      }
      setSelectedOptionByItemId((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [selectedIdProp],
  );

  const value = useMemo<MainMenuTopContextValue>(
    () => ({
      size,
      selectedId,
      openMenuId,
      selectedOptionByItemId,
      focusedId,
      setFocusedId,
      openTopMenu,
      closeTopMenu,
      selectNavItem,
      clearNavItemSelection,
      setSelectedOption,
      onMenuItemSelect,
    }),
    [
      size,
      selectedId,
      openMenuId,
      selectedOptionByItemId,
      focusedId,
      openTopMenu,
      closeTopMenu,
      selectNavItem,
      clearNavItemSelection,
      setSelectedOption,
      onMenuItemSelect,
    ],
  );

  return (
    <MainMenuTopContext.Provider value={value}>{children}</MainMenuTopContext.Provider>
  );
}
