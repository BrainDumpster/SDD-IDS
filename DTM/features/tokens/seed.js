import fs from "node:fs";
import { groupForSection } from "../groups/groups.js";
import { FIGMA_FILE_KEY, FIGMA_LIBRARY_URL, IDS_THEME_PATH } from "../paths.js";
import { writeCatalog } from "../tokens/store.js";
import { validateCatalog } from "../validation/validate.js";

function sectionKind(comment) {
  const text = comment.toLowerCase();
  if (text.startsWith("primitive")) return "primitive";
  if (text.startsWith("sizes")) return "sizes";
  if (text.startsWith("shadows")) return "shadows";
  if (text.includes("dropdown shadow")) return "shadow-alias";
  if (text.includes("component layout")) return "component";
  if (text.startsWith("semantic")) return "semantic";
  return null;
}

function parseBlock(block) {
  let section = "semantic";
  const props = [];
  for (const line of block.split("\n")) {
    const comment = line.match(/\/\*\s*---\s*(.*?)\s*---\s*\*\//);
    if (comment) {
      const kind = sectionKind(comment[1]);
      if (kind) section = kind;
      continue;
    }
    const prop = line.match(/^\s*(--[\w-]+)\s*:\s*([^;]+);/);
    if (prop) props.push({ name: prop[1], value: prop[2].trim(), section });
  }
  return props;
}

export function seedCatalogFromCss(css, { write = false } = {}) {
  const light = css.match(
    /html\[data-design-system="ids"\],\s*body\[data-design-system="ids"\]\s*\{([\s\S]*?)\n\}/,
  );
  const dark = css.match(
    /html\[data-design-system="ids"\]\[data-theme="dark"\][\s\S]*?\{([\s\S]*?)\n\}/,
  );
  if (!light || !dark) {
    throw new Error("Could not parse light and dark blocks from components/ids-theme.css");
  }
  const darkValues = new Map(parseBlock(dark[1]).map((row) => [row.name, row.value]));
  const tokens = parseBlock(light[1]).map((row) => {
    const values = { light: row.value };
    const darkValue = darkValues.get(row.name);
    if (darkValue != null && darkValue !== row.value) values.dark = darkValue;
    return {
      group: groupForSection(row.section, row.name),
      name: row.name,
      alias: "",
      values,
    };
  });
  const catalog = {
    source: {
      themeCss: "components/ids-theme.css",
      figmaLibrary: FIGMA_LIBRARY_URL,
      figmaFileKey: FIGMA_FILE_KEY,
      seededFrom: "components/ids-theme.css",
    },
    themes: [
      { id: "light", label: "Light", default: true },
      { id: "dark", label: "Dark", default: false },
    ],
    tokens,
  };
  const validation = validateCatalog(catalog);
  if (!validation.ok) {
    const sample = validation.errors.slice(0, 12);
    throw new Error(`Catalog validation failed (${validation.errors.length}): ${JSON.stringify(sample, null, 2)}`);
  }
  if (write) writeCatalog(catalog);
  return catalog;
}

export function seedFromIdsThemeFile() {
  const css = fs.readFileSync(IDS_THEME_PATH, "utf8");
  return seedCatalogFromCss(css, { write: true });
}
