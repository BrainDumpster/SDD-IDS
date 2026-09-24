import { readCatalog, writeCatalog } from "../tokens/store.js";
import { validateCatalog } from "../validation/validate.js";

const THEME_ID = /^[a-z0-9-]+$/;

export function listThemes() {
  return readCatalog().themes;
}

export function createTheme({ id, label }) {
  const themeId = String(id ?? "").trim();
  const themeLabel = String(label ?? "").trim();
  if (!THEME_ID.test(themeId)) {
    return { status: "rejected", errors: [{ field: "id", message: "Theme id must be lowercase letters, digits, and hyphens." }] };
  }
  if (!themeLabel) {
    return { status: "rejected", errors: [{ field: "label", message: "Theme label is required." }] };
  }
  const catalog = readCatalog();
  if (catalog.themes.some((theme) => theme.id === themeId)) {
    return { status: "rejected", errors: [{ field: "id", message: "Theme id is already used." }] };
  }
  catalog.themes.push({ id: themeId, label: themeLabel, default: false });
  writeCatalog(catalog);
  return { status: "created", theme: { id: themeId, label: themeLabel, default: false } };
}

export function deleteTheme(id) {
  const catalog = readCatalog();
  const theme = catalog.themes.find((item) => item.id === id);
  if (!theme) return { status: "missing" };
  if (theme.default) return { status: "rejected", errors: [{ field: "id", message: "The default theme cannot be deleted." }] };
  catalog.themes = catalog.themes.filter((item) => item.id !== id);
  for (const token of catalog.tokens) delete token.values[id];
  const check = validateCatalog(catalog);
  if (!check.ok) return { status: "rejected", errors: check.errors };
  writeCatalog(catalog);
  return { status: "deleted", id };
}

export function valueFor(token, themeId) {
  if (!themeId || themeId === "light") return { value: token.values.light, inherited: false };
  if (token.values[themeId] != null && String(token.values[themeId]).trim()) {
    return { value: token.values[themeId], inherited: false };
  }
  return { value: token.values.light, inherited: true };
}
