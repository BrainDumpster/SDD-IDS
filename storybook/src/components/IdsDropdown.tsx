import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { DropdownMenu } from "./DropdownMenu";
import { IdsDropdownTriggerShell } from "./IdsDropdownTriggerShell";
import type { IdsDropdownTriggerShellProps } from "./IdsDropdownTriggerShell";
import statusCriticalSquareSolidIcon from "../../../assets/icons/status-critical-square-solid.svg";

export type IdsDropdownMode =
  | "combobox-single"
  | "combobox-multi"
  | "single-select"
  | "multi-select";

type SelectionMode = "single" | "multi";

interface DropdownContextValue {
  mode: IdsDropdownMode;
  selectionMode: SelectionMode;
  disabled: boolean;
  selectedValues: string[];
  showSingleSelectRadio: boolean;
  toggleValue: (value: string) => void;
  registerDescribedBy: (id: string) => void;
  unregisterDescribedBy: (id: string) => void;
}

const IdsDropdownContext = createContext<DropdownContextValue | null>(null);

function useIdsDropdownContext(): DropdownContextValue {
  const ctx = useContext(IdsDropdownContext);
  if (!ctx) {
    throw new Error("IdsDropdown compound components must be used within <IdsDropdown>");
  }
  return ctx;
}

function selectionModeForMode(mode: IdsDropdownMode): SelectionMode {
  return mode === "combobox-multi" || mode === "multi-select" ? "multi" : "single";
}

export interface IdsDropdownProps {
  mode: IdsDropdownMode;
  disabled?: boolean;
  showSingleSelectRadio?: boolean;
  value?: string;
  values?: string[];
  defaultValue?: string;
  defaultValues?: string[];
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  onSelectionChange?: (value: string | string[]) => void;
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function IdsDropdown({
  mode,
  disabled = false,
  showSingleSelectRadio = false,
  value,
  values,
  defaultValue,
  defaultValues = [],
  onValueChange,
  onValuesChange,
  onSelectionChange,
  children,
  style,
  className,
}: IdsDropdownProps) {
  const selectionMode = selectionModeForMode(mode);
  const isSingleControlled = value !== undefined;
  const isMultiControlled = values !== undefined;

  const [internalSingle, setInternalSingle] = useState(defaultValue ?? "");
  const [internalMulti, setInternalMulti] = useState<string[]>(defaultValues);
  const [describedByIds, setDescribedByIds] = useState<string[]>([]);

  const selectedValues = useMemo(() => {
    if (selectionMode === "single") {
      const single = isSingleControlled ? (value ?? "") : internalSingle;
      return single ? [single] : [];
    }
    return isMultiControlled ? (values ?? []) : internalMulti;
  }, [
    selectionMode,
    isSingleControlled,
    value,
    internalSingle,
    isMultiControlled,
    values,
    internalMulti,
  ]);

  const toggleValue = useCallback(
    (nextValue: string) => {
      if (disabled) return;
      if (selectionMode === "single") {
        if (!isSingleControlled) setInternalSingle(nextValue);
        onValueChange?.(nextValue);
        onSelectionChange?.(nextValue);
        return;
      }

      if (!isMultiControlled) {
        setInternalMulti((prev) => {
          const next = prev.includes(nextValue)
            ? prev.filter((entry) => entry !== nextValue)
            : [...prev, nextValue];
          onValuesChange?.(next);
          onSelectionChange?.(next);
          return next;
        });
        return;
      }

      const next = selectedValues.includes(nextValue)
        ? selectedValues.filter((entry) => entry !== nextValue)
        : [...selectedValues, nextValue];
      onValuesChange?.(next);
      onSelectionChange?.(next);
    },
    [
      disabled,
      isMultiControlled,
      isSingleControlled,
      onSelectionChange,
      onValueChange,
      onValuesChange,
      selectedValues,
      selectionMode,
    ],
  );

  const registerDescribedBy = useCallback((id: string) => {
    setDescribedByIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const unregisterDescribedBy = useCallback((id: string) => {
    setDescribedByIds((prev) => prev.filter((entry) => entry !== id));
  }, []);

  const contextValue = useMemo<DropdownContextValue>(
    () => ({
      mode,
      selectionMode,
      disabled,
      selectedValues,
      showSingleSelectRadio,
      toggleValue,
      registerDescribedBy,
      unregisterDescribedBy,
    }),
    [
      mode,
      selectionMode,
      disabled,
      selectedValues,
      showSingleSelectRadio,
      toggleValue,
      registerDescribedBy,
      unregisterDescribedBy,
    ],
  );

  return (
    <IdsDropdownContext.Provider value={contextValue}>
      <div
        className={className}
        style={{ display: "grid", gap: 0, width: "100%", maxWidth: 700, minWidth: 186, ...style }}
      >
        {children}
      </div>
    </IdsDropdownContext.Provider>
  );
}

type MenuItemModel = {
  id?: string;
  label: string;
  value?: string;
  disabled?: boolean;
  kind?: "item" | "section";
  selectable?: boolean;
  onClick?: () => void;
};

function isMenuItemElement(child: ReactElement): child is ReactElement<IdsDropdownMenuItemProps> {
  return child.type === IdsDropdownMenuItem;
}

function isMenuGroupElement(child: ReactElement): child is ReactElement<IdsDropdownMenuGroupProps> {
  return child.type === IdsDropdownMenuGroup;
}

function buildMenuItems(menuChildren: ReactNode, toggleValue: (value: string) => void): MenuItemModel[] {
  const items: MenuItemModel[] = [];
  for (const child of Children.toArray(menuChildren)) {
    if (!isValidElement(child)) continue;
    if (isMenuGroupElement(child)) {
      items.push({
        id: `section-${child.props.groupName}`,
        label: child.props.groupName,
        kind: "section",
      });
      for (const groupChild of Children.toArray(child.props.children)) {
        if (!isValidElement(groupChild) || !isMenuItemElement(groupChild)) continue;
        const { value: itemValue, label, disabled } = groupChild.props;
        items.push({
          id: itemValue,
          value: itemValue,
          label,
          disabled,
          selectable: true,
          onClick: () => toggleValue(itemValue),
        });
      }
      continue;
    }
    if (isMenuItemElement(child)) {
      const { value: itemValue, label, disabled } = child.props;
      items.push({
        id: itemValue,
        value: itemValue,
        label,
        disabled,
        selectable: true,
        onClick: () => toggleValue(itemValue),
      });
    }
  }
  return items;
}

export interface IdsDropdownMenuProps extends Omit<
  React.ComponentProps<typeof DropdownMenu>,
  | "trigger"
  | "items"
  | "selectionMode"
  | "selectedValues"
  | "showSingleSelectRadio"
  | "disabled"
  | "footerActionLabel"
  | "onFooterActionClick"
> {
  children: ReactNode;
}

export function IdsDropdownMenu({ children, ...menuProps }: IdsDropdownMenuProps) {
  const ctx = useIdsDropdownContext();
  const childNodes = Children.toArray(children);

  let trigger: ReactNode = null;
  let footerLabel: string | undefined;
  let footerClick: (() => void) | undefined;
  const menuChildren: ReactNode[] = [];

  for (const child of childNodes) {
    if (!isValidElement(child)) continue;
    if (child.type === IdsDropdownTriggerShell) {
      trigger = child;
    } else if (child.type === IdsDropdownMenuFooter) {
      footerLabel = child.props.actionLabel;
      footerClick = child.props.onAction;
    } else {
      menuChildren.push(child);
    }
  }

  const items = buildMenuItems(menuChildren, ctx.toggleValue);

  return (
    <DropdownMenu
      {...menuProps}
      disabled={ctx.disabled}
      selectionMode={ctx.selectionMode}
      selectedValues={ctx.selectedValues}
      showSingleSelectRadio={ctx.showSingleSelectRadio}
      trigger={trigger}
      items={items}
      footerActionLabel={footerLabel}
      onFooterActionClick={footerClick}
      fullWidth
    />
  );
}

export interface IdsDropdownMenuGroupProps {
  groupName: string;
  children: ReactNode;
}

export function IdsDropdownMenuGroup({ children }: IdsDropdownMenuGroupProps) {
  return <>{children}</>;
}

export interface IdsDropdownMenuItemProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export function IdsDropdownMenuItem(_props: IdsDropdownMenuItemProps) {
  return null;
}

export interface IdsDropdownMenuFooterProps {
  actionLabel: string;
  onAction?: () => void;
}

export function IdsDropdownMenuFooter(_props: IdsDropdownMenuFooterProps) {
  return null;
}

export interface IdsDropdownHelperProps {
  children: ReactNode;
}

export function IdsDropdownHelper({ children }: IdsDropdownHelperProps) {
  const { registerDescribedBy, unregisterDescribedBy } = useIdsDropdownContext();
  const id = useId();

  useEffect(() => {
    registerDescribedBy(id);
    return () => unregisterDescribedBy(id);
  }, [registerDescribedBy, unregisterDescribedBy, id]);

  return (
    <p
      id={id}
      style={{
        margin: "var(--spacing-space-4) 0 0",
        fontSize: "var(--font-size-body-2)",
        lineHeight: "var(--font-line-height-line-height-20)",
        color: "var(--color-text-neutral)",
      }}
    >
      {children}
    </p>
  );
}

export interface IdsDropdownErrorProps {
  children: ReactNode;
}

export function IdsDropdownError({ children }: IdsDropdownErrorProps) {
  const { registerDescribedBy, unregisterDescribedBy } = useIdsDropdownContext();
  const id = useId();

  useEffect(() => {
    registerDescribedBy(id);
    return () => unregisterDescribedBy(id);
  }, [registerDescribedBy, unregisterDescribedBy, id]);

  return (
    <p
      id={id}
      style={{
        margin: "var(--spacing-space-4) 0 0",
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-space-8)",
        fontSize: "var(--font-size-body-2)",
        lineHeight: "var(--font-line-height-line-height-20)",
        color: "var(--color-text-critical)",
      }}
    >
      <img src={statusCriticalSquareSolidIcon} alt="" aria-hidden width={16} height={16} />
      <span>{children}</span>
    </p>
  );
}

IdsDropdown.Menu = IdsDropdownMenu;
IdsDropdown.MenuGroup = IdsDropdownMenuGroup;
IdsDropdown.MenuItem = IdsDropdownMenuItem;
IdsDropdown.MenuFooter = IdsDropdownMenuFooter;
IdsDropdown.Helper = IdsDropdownHelper;
IdsDropdown.Error = IdsDropdownError;
IdsDropdown.TriggerShell = IdsDropdownTriggerShell;

export { IdsDropdownTriggerShell };
export type { IdsDropdownTriggerShellProps };
