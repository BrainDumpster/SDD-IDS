/** Programme display names for Spec Generated Storybook sidebar groups. */
export type SpecProgramme = "IDS" | "DAP" | "Synapse";

export const SPEC_GENERATED_ROOT = "Spec Generated" as const;
export const SPEC_ACCURATE_DESIGN_STORY = "Spec Accurate Design" as const;

export function specGeneratedTitle(programme: SpecProgramme, componentDisplayName: string): string {
  return `${SPEC_GENERATED_ROOT}/${programme}/${componentDisplayName}`;
}

export function themeCssPathForProgramme(programme: Lowercase<SpecProgramme>): string {
  switch (programme) {
    case "dap":
      return "components/dap-theme.css";
    case "synapse":
      return "components/synapse-theme.css";
    default:
      return "components/ids-theme.css";
  }
}
