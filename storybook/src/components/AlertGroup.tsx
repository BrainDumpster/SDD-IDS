import { Children, useState, type ReactNode } from "react";
import {
  type AlertItemProps,
  isAlertItemElement,
  parseAlertSlots,
} from "@component-contracts/ids/alert.react-bridge";
import { Alert } from "./Alert";

export interface AlertGroupProps {
  children: ReactNode;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onDismiss?: () => void;
}

export function AlertGroup({
  children,
  activeIndex: controlledIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  onDismiss,
}: AlertGroupProps) {
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const [dismissed, setDismissed] = useState(false);

  const items = Children.toArray(children).filter(isAlertItemElement);
  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;
  const safeIndex = total > 0 ? ((activeIndex % total) + total) % total : 0;
  const active = items[safeIndex];

  const setActiveIndex = (next: number) => {
    if (total === 0) {
      return;
    }
    const wrapped = ((next % total) + total) % total;
    onActiveIndexChange?.(wrapped);
    if (controlledIndex === undefined) {
      setInternalIndex(wrapped);
    }
  };

  if (dismissed || !active) {
    return null;
  }

  const slots = parseAlertSlots(active.props.children);
  const itemProps = active.props as AlertItemProps;

  return (
    <div className="ids-alert-group">
      <Alert
        display="global"
        severity={itemProps.severity}
        message={slots.messageText || itemProps.message || ""}
        linkLabel={slots.linkLabel || itemProps.linkLabel}
        linkHref={slots.linkHref || itemProps.linkHref || "#"}
        actionLabel={slots.actionLabel || itemProps.actionLabel}
        dismissible
        onDismiss={() => {
          setDismissed(true);
          onDismiss?.();
        }}
        carousel={
          total > 1
            ? {
                currentItem: safeIndex + 1,
                totalItems: total,
                onPrevious: () => setActiveIndex(safeIndex - 1),
                onNext: () => setActiveIndex(safeIndex + 1),
              }
            : undefined
        }
      />
    </div>
  );
}

export { AlertItem } from "@component-contracts/ids/alert.react-bridge";
