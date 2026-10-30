/**
 * IDS Link — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/link`
 * Source: `components/ids/link/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   root (`<a>` | `<button>`)
 *     label
 *     externalIcon?  — lib `IdsIcon` (`pop-up-square-corner-big`, 16px)
 *
 * No @base-ui-components dependency.
 */

import React, {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactElement,
} from "react";
import { IdsIcon } from "../icon";
import styles from "./IdsLink.module.css";

export type IdsLinkType = "standalone" | "inline" | "dark-bg";

export type IdsLinkDataState =
  | "default"
  | "hover"
  | "press"
  | "focus-visible";

export type IdsLinkTarget = "_self" | "_blank" | "_parent" | "_top";

const LINK_TYPES = new Set<IdsLinkType>(["standalone", "inline", "dark-bg"]);

const EXTERNAL_ICON_SHAPE = "pop-up-square-corner-big";

type SharedProps = {
  /** Required visible label. Empty → `"Link"` + development warning. */
  label: string;
  /** Variant axis `Type`. Unknown → `standalone`. */
  type?: IdsLinkType | string;
  /** When set, renders native `<a>`; otherwise button semantics. */
  href?: string;
  showExternalLinkIcon?: boolean;
  target?: IdsLinkTarget;
  /** When `target="_blank"`, defaults to `noopener noreferrer` unless set. */
  rel?: string;
  disabled?: boolean;
  /** Demo/testing visual override only — does not replace interaction logic. */
  dataState?: IdsLinkDataState;
  className?: string;
  onClick?: (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
};

export type IdsLinkProps = SharedProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement> &
      ButtonHTMLAttributes<HTMLButtonElement>,
    keyof SharedProps | "children" | "type" | "href" | "target" | "rel"
  >;

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveType(value: unknown): IdsLinkType {
  if (typeof value === "string" && LINK_TYPES.has(value as IdsLinkType)) {
    return value as IdsLinkType;
  }
  return "standalone";
}

function resolveLabel(label: string): string {
  if (label == null || String(label).trim() === "") {
    if (import.meta.env?.DEV) {
      console.warn('IdsLink: empty `label` — rendering fallback text "Link".');
    }
    return "Link";
  }
  return String(label);
}

function resolveRel(
  target: IdsLinkTarget | undefined,
  rel: string | undefined,
): string | undefined {
  if (rel != null) return rel;
  if (target === "_blank") return "noopener noreferrer";
  return undefined;
}

function typeClass(type: IdsLinkType): string {
  return styles[`ids-link--${type}`];
}

export const IdsLink = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  IdsLinkProps
>(function IdsLink(
  {
    label: labelProp,
    type: typeProp = "standalone",
    href,
    showExternalLinkIcon = false,
    target = "_self",
    rel: relProp,
    disabled = false,
    dataState,
    className,
    onClick,
    ...rest
  },
  ref,
): ReactElement {
  const type = resolveType(typeProp);
  const label = resolveLabel(labelProp);
  const rel = resolveRel(target, relProp);
  const stateAttr =
    dataState && dataState !== "default" ? dataState : undefined;

  const classNames = cx(
    styles["ids-link"],
    typeClass(type),
    className,
  );

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const icon =
    showExternalLinkIcon ? (
      <span
        className={styles["ids-link-external-icon"]}
        data-ids="ids-link-external-icon"
        aria-hidden="true"
      >
        <IdsIcon shape={EXTERNAL_ICON_SHAPE} size={16} />
      </span>
    ) : null;

  const content = (
    <>
      <span className={styles["ids-link-label"]} data-ids="ids-link-label">
        {label}
      </span>
      {icon}
    </>
  );

  const shared = {
    className: classNames,
    "data-ids": "ids-link" as const,
    "data-type": type,
    "data-state": stateAttr,
    "data-external-icon": showExternalLinkIcon ? ("true" as const) : undefined,
    onClick: handleClick,
  };

  if (href != null && href !== "") {
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        {...shared}
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        target={target === "_self" ? undefined : target}
        rel={rel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      {...shared}
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      aria-disabled={disabled || undefined}
    >
      {content}
    </button>
  );
});

IdsLink.displayName = "IdsLink";

export default IdsLink;
