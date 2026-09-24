import fs from "node:fs";
import path from "node:path";
import { CATALOG_PATH } from "../paths.js";

function orderToken(token) {
  const values = {};
  const source = token.values ?? {};
  if (source.light != null) values.light = source.light;
  for (const key of Object.keys(source).sort()) {
    if (key !== "light" && String(source[key] ?? "").trim()) values[key] = source[key];
  }
  return {
    group: token.group,
    name: token.name,
    alias: String(token.alias ?? ""),
    values,
  };
}

export function normalizeCatalog(catalog) {
  const themes = [...(catalog.themes ?? [])].sort((a, b) => {
    if (a.default && !b.default) return -1;
    if (!a.default && b.default) return 1;
    return a.id.localeCompare(b.id);
  });
  const tokens = [...(catalog.tokens ?? [])].map(orderToken).sort((a, b) => a.name.localeCompare(b.name));
  return {
    source: catalog.source ?? {},
    themes,
    tokens,
  };
}

export function readCatalog(file = CATALOG_PATH) {
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw);
}

export function writeCatalog(catalog, file = CATALOG_PATH) {
  const next = normalizeCatalog(catalog);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const text = `${JSON.stringify(next, null, 2)}\n`;
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, text);
  fs.renameSync(temporary, file);
  return next;
}
