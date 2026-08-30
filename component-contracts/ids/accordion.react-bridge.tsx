/**
 * React Storybook bridge — re-exports framework-agnostic contract + React form demos.
 */
export * from "./accordion.contract";

import React, { type ReactNode } from "react";
import {
  ACCORDION_API_DEFAULTS as ACCORDION_API_DEFAULTS_BASE,
  ACCORDION_SPEC_DEMO_ITEMS as ACCORDION_SPEC_DEMO_ITEMS_BASE,
  type AccordionChevronPosition,
  type AccordionVariant,
} from "./accordion.contract";

export interface IdsAccordionItem {
  value: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
  meta?: ReactNode;
  formSlot?: ReactNode;
}

export interface IdsAccordionProps {
  items: IdsAccordionItem[];
  multiple?: boolean;
  defaultValue?: string[];
  variant?: AccordionVariant;
  chevronPosition?: AccordionChevronPosition;
}

export const ACCORDION_ROOT_PROP_KEYS = [
  "items",
  "multiple",
  "defaultValue",
  "chevronPosition",
  "variant",
] as const;

export const ACCORDION_ITEM_INPUT_KEYS = [
  "value",
  "title",
  "content",
  "disabled",
  "meta",
  "formSlot",
] as const;

export const ACCORDION_CODEGEN_ANATOMY = [
  "AccordionRoot",
  "AccordionItem",
  "AccordionHeader",
  "AccordionChevron?",
  "title",
  "AccordionChevron?",
  "AccordionBody",
  "AccordionContent",
  "AccordionMetaSlot?",
  "AccordionFormSlot?",
] as const;

export const ACCORDION_VARIANT_MATRIX = {
  variant: ["default", "form"] as const,
  chevronPosition: ["left", "right"] as const,
  expandBehavior: ["single", "multiple"] as const,
  itemState: ["collapsed", "expanded", "disabled"] as const,
};

export const ACCORDION_API_DEFAULTS_REACT: Pick<
  IdsAccordionProps,
  "multiple" | "chevronPosition" | "variant"
> = {
  multiple: ACCORDION_API_DEFAULTS_BASE.multiple,
  chevronPosition: ACCORDION_API_DEFAULTS_BASE.chevronPosition,
  variant: ACCORDION_API_DEFAULTS_BASE.variant,
};

export const ACCORDION_SPEC_DEMO_ITEMS_REACT: IdsAccordionItem[] =
  ACCORDION_SPEC_DEMO_ITEMS_BASE.map((item) => ({
    value: item.value,
    title: item.title,
    content: item.content,
    disabled: item.disabled,
    meta: item.meta,
  }));

export const ACCORDION_SPEC_DISABLED_ITEM: IdsAccordionItem = {
  value: "locked",
  title: "Premium features (locked)",
  content: "Upgrade to access.",
  disabled: true,
};

const formNetworkSlot: ReactNode = (
  <div style={{ display: "grid", gap: 8 }}>
    <label>
      Host
      <input style={{ marginLeft: 8 }} defaultValue="localhost" />
    </label>
    <label>
      Port
      <input style={{ marginLeft: 8 }} defaultValue="8080" />
    </label>
  </div>
);

const formSecuritySlot: ReactNode = (
  <div style={{ display: "grid", gap: 8 }}>
    <label>
      <input type="checkbox" defaultChecked /> Enable TLS
    </label>
    <label>
      <input type="checkbox" /> Require client certificate
    </label>
  </div>
);

export const ACCORDION_SPEC_FORM_ITEMS_REACT: IdsAccordionItem[] = [
  {
    value: "form1",
    title: "Network settings",
    content: "Configure values for this section.",
    formSlot: formNetworkSlot,
  },
  {
    value: "form2",
    title: "Security options",
    content: "Toggle security-related preferences.",
    formSlot: formSecuritySlot,
  },
];

export const ACCORDION_SPEC_META_SAMPLE: ReactNode = (
  <span>Helper metadata slot (AccordionMetaSlot).</span>
);

/** React Storybook aliases (ReactNode `content` / form slots). */
export {
  ACCORDION_SPEC_DEMO_ITEMS_REACT as ACCORDION_SPEC_DEMO_ITEMS,
  ACCORDION_SPEC_FORM_ITEMS_REACT as ACCORDION_SPEC_FORM_ITEMS,
  ACCORDION_API_DEFAULTS_REACT as ACCORDION_API_DEFAULTS,
};
