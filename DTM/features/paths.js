import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const DTM_ROOT = path.resolve(here, "..");
export const REPO_ROOT = path.resolve(DTM_ROOT, "..");
export const CATALOG_PATH = path.join(DTM_ROOT, "records", "catalog.json");
export const IDS_THEME_PATH = path.join(REPO_ROOT, "components", "ids-theme.css");

export const PROGRAMMES = {
  synapse: {
    files: [
      path.join(REPO_ROOT, "components", "synapse-theme.css"),
      path.join(REPO_ROOT, "storybook", "src", "synapse-theme.css"),
    ],
  },
  dap: {
    files: [path.join(REPO_ROOT, "components", "dap-theme.css")],
  },
  powerflex: {
    files: [path.join(REPO_ROOT, "components", "powerflex-theme.css")],
  },
};

export const FIGMA_LIBRARY_URL =
  "https://www.figma.com/design/r0Ex6TumqcR3HINamsfXCV/IDS-Variables-Library";
export const FIGMA_FILE_KEY = "r0Ex6TumqcR3HINamsfXCV";
