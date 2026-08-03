/**
 * IDS Accordion — runtime contract mirrored from the design spec.
 *
 * Source: `components/ids/accordion/design-spec.md`
 * - § Composition & API (runtime)
 * - § Codegen Contract (Framework-Agnostic Blueprint)
 *
 * Storybook stories and codegen QA should import this module so examples and
 * structural checks stay aligned with the spec (MDX is not parsed by Storybook).
 */
import type { ReactNode } from "react";
import type { IdsAccordionItem, IdsAccordionProps } from "../components/IdsAccordion";

/** Repo-relative path to the MDX spec (for tooling / docs cross-links). */
export const IDS_ACCORDION_DESIGN_SPEC_PATH =
  "components/ids/accordion/design-spec.md" as const;

/** Root props named in design-spec § Composition & API (runtime). */
export const ACCORDION_ROOT_PROP_KEYS = [
  "items",
  "multiple",
  "defaultValue",
  "chevronPosition",
] as const;

/** Per-item inputs from design-spec § Composition & API (runtime). */
export const ACCORDION_ITEM_INPUT_KEYS = [
  "value",
  "title",
  "content",
  "meta",
] as const;

export type AccordionRootPropKey = (typeof ACCORDION_ROOT_PROP_KEYS)[number];
export type AccordionItemInputKey = (typeof ACCORDION_ITEM_INPUT_KEYS)[number];

/**
 * Deterministic anatomy from design-spec § Codegen Contract (ordered slots).
 * Optional branches use `?`. Chevron appears leading or trailing per `chevronPosition`.
 * `AccordionHeader` is the trigger surface (single public slot); inner library `Trigger` / `button` is implementation-only.
 */
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
] as const;

/** Variant matrix from design-spec § Codegen Contract. */
export const ACCORDION_VARIANT_MATRIX = {
  chevronPosition: ["left", "right"] as const,
  expandBehavior: ["single", "multiple"] as const,
  itemState: ["collapsed", "expanded"] as const,
};

/** Defaults from design-spec Composition & API. */
export const ACCORDION_API_DEFAULTS: Pick<
  IdsAccordionProps,
  "multiple" | "chevronPosition"
> = {
  multiple: false,
  chevronPosition: "left",
};

/** Stable demo items (shared with Synapse accordion stories for visual parity). */
export const ACCORDION_SPEC_DEMO_ITEMS: IdsAccordionItem[] = [
  {
    value: "section1",
    title: "What is Synapse?",
    content:
      "Synapse is a design system providing consistent, accessible UI components for enterprise applications.",
  },
  {
    value: "section2",
    title: "How do I get started?",
    content:
      "Install @base-ui-components/react and import the Synapse theme CSS. Then use the components in your React application.",
  },
  {
    value: "section3",
    title: "Is dark mode supported?",
    content:
      'Yes. Set data-theme="dark" on your root element. All Synapse tokens automatically switch to dark values.',
  },
];

/** Optional `meta` slot demo — not used in base stories; available for codegen / extended stories. */
export const ACCORDION_SPEC_META_SAMPLE: ReactNode = (
  <span>Helper metadata slot (AccordionMetaSlot).</span>
);

/**
 * Asserts per-item `value` keys are unique (design-spec validation: duplicate value is an error).
 * Use in tests / codegen smoke checks.
 */
export function assertAccordionItemValuesUnique(items: Pick<IdsAccordionItem, "value">[]): void {
  const seen = new Set<string>();
  for (const { value } of items) {
    if (seen.has(value)) {
      throw new Error(`Duplicate accordion item value: ${value}`);
    }
    seen.add(value);
  }
}

assertAccordionItemValuesUnique(ACCORDION_SPEC_DEMO_ITEMS);
