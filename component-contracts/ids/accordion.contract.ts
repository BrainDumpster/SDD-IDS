/**
 * IDS Accordion — framework-agnostic spec contract.
 * Source: `components/ids/accordion/design-spec.md`
 */
export const IDS_ACCORDION_DESIGN_SPEC_PATH =
  "components/ids/accordion/design-spec.md" as const;

export const ACCORDION_CHEVRON_ICON_SLUG = "chev-down-thick" as const;

export type AccordionChevronPosition = "left" | "right";
export type AccordionVariant = "default" | "form";

export interface IdsAccordionItemInput {
  value: string;
  title: string;
  content: string;
  disabled?: boolean;
  meta?: string;
  /** Form variant only — plain-text hint; frameworks may replace with projected templates. */
  formSlotLabel?: string;
}

export const ACCORDION_API_DEFAULTS = {
  multiple: false,
  chevronPosition: "left" as AccordionChevronPosition,
  variant: "default" as AccordionVariant,
} as const;

export const ACCORDION_SPEC_DEMO_ITEMS: IdsAccordionItemInput[] = [
  {
    value: "section1",
    title: "Network configuration",
    content:
      "Configure network policies and service endpoints for this workspace. Learn how network policies work in the admin guide.",
  },
  {
    value: "section2",
    title: "Security controls",
    content: "Manage access rules, authentication options, and audit controls for your environment.",
  },
  {
    value: "section3",
    title: "Integrations",
    content: "Connect external systems and event pipelines. This section is disabled in the demo matrix.",
    disabled: true,
  },
];

/** Spec Accurate Design: single-expand, first panel open, left chevron, default variant. */
export const ACCORDION_SPEC_ACCURATE_DEFAULTS = {
  ...ACCORDION_API_DEFAULTS,
  defaultValue: ["section1"] as string[],
  items: ACCORDION_SPEC_DEMO_ITEMS,
} as const;

export const ACCORDION_SPEC_FORM_ITEMS: IdsAccordionItemInput[] = [
  {
    value: "form1",
    title: "Network settings",
    content: "Configure values for this section.",
    formSlotLabel: "Host and port",
  },
  {
    value: "form2",
    title: "Security options",
    content: "Toggle security-related preferences.",
    formSlotLabel: "TLS and client certificate",
  },
];

// Side-effect assertions run only when explicitly invoked (safe for Storybook CSF import).
export function assertAccordionItemValuesUnique(
  items: Pick<IdsAccordionItemInput, "value">[],
): void {
  const seen = new Set<string>();
  for (const { value } of items) {
    if (seen.has(value)) {
      throw new Error(`Duplicate accordion item value: ${value}`);
    }
    seen.add(value);
  }
}
