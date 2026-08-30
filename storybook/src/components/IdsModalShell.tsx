import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import styles from "./IdsModal.module.css";

export type IdsModalShellLayer = "main" | "carousel" | "single-preview";

const LAYER_BACKDROP_CLASS: Record<IdsModalShellLayer, string | undefined> = {
  main: undefined,
  carousel: styles.backdropCarousel,
  "single-preview": styles.backdropSinglePreview,
};

const LAYER_POPUP_CLASS: Record<IdsModalShellLayer, string | undefined> = {
  main: undefined,
  carousel: styles.popupCarousel,
  "single-preview": styles.popupSinglePreview,
};

export interface IdsModalShellProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  /** Stacked modal layer — main (default), carousel, or single-preview (What's New stack). */
  layer?: IdsModalShellLayer;
  labelledBy?: string;
  describedBy?: string;
  popupRef?: Ref<HTMLDivElement>;
  backdropClassName?: string;
  popupClassName?: string;
}

function joinClasses(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function IdsModalShell({
  open,
  onOpenChange,
  children,
  layer = "main",
  labelledBy,
  describedBy,
  popupRef,
  backdropClassName,
  popupClassName,
}: IdsModalShellProps) {
  return (
    <BaseDialog.Root modal open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className={joinClasses(
            styles.backdrop,
            LAYER_BACKDROP_CLASS[layer],
            backdropClassName,
          )}
        />
        <BaseDialog.Popup
          ref={popupRef}
          className={joinClasses(styles.popup, LAYER_POPUP_CLASS[layer], popupClassName)}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
        >
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export type IdsModalShellCloseProps = ComponentPropsWithoutRef<typeof BaseDialog.Close>;

export function IdsModalShellClose(props: IdsModalShellCloseProps) {
  return <BaseDialog.Close {...props} />;
}

IdsModalShell.Close = IdsModalShellClose;
