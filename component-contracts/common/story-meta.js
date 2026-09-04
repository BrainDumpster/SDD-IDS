export const SPEC_GENERATED_ROOT = "Components";
export const SPEC_ACCURATE_DESIGN_STORY = "Spec Accurate Design";
export function specGeneratedTitle(programme, componentDisplayName) {
    return `${SPEC_GENERATED_ROOT}/${programme}/${componentDisplayName}`;
}
export function themeCssPathForProgramme(programme) {
    switch (programme) {
        case "dap":
            return "components/dap-theme.css";
        case "synapse":
            return "components/synapse-theme.css";
        default:
            return "components/ids-theme.css";
    }
}
