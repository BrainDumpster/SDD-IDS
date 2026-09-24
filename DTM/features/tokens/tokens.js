import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "../paths.js";
import { readCatalog, writeCatalog } from "./store.js";
import { validateCatalog, validateTokenDraft } from "../validation/validate.js";

function walk(dir, acc) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "storybook-static") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
}

export function findNameInUse(name) {
  const needle = `var(${name})`;
  const files = [];
  walk(path.join(REPO_ROOT, "components"), files);
  const hits = [];
  for (const file of files) {
    if (!file.endsWith(".md") && !file.endsWith(".css")) continue;
    if (file.endsWith(`${path.sep}ids-theme.css`)) continue;
    const text = fs.readFileSync(file, "utf8");
    if (text.includes(needle) || (file.endsWith("-theme.css") && text.includes(`${name}:`))) {
      hits.push(path.relative(REPO_ROOT, file));
    }
  }
  return hits;
}

export function listTokens({ group, q, theme } = {}) {
  const catalog = readCatalog();
  const query = String(q ?? "").trim().toLowerCase();
  let tokens = catalog.tokens;
  if (group) tokens = tokens.filter((token) => token.group === group);
  if (query) {
    tokens = tokens.filter((token) =>
      token.name.toLowerCase().includes(query) || String(token.alias ?? "").toLowerCase().includes(query),
    );
  }
  return tokens.map((token) => present(token, theme));
}

export function getToken(name) {
  const catalog = readCatalog();
  return catalog.tokens.find((token) => token.name === name) ?? null;
}

function present(token, theme) {
  const themeId = theme && theme !== "light" ? theme : "light";
  const own = token.values[themeId];
  const value = own ?? token.values.light;
  return {
    ...token,
    theme: themeId,
    value,
    inherited: themeId !== "light" && own == null,
  };
}

export function createToken(draft) {
  const catalog = readCatalog();
  const check = validateTokenDraft(draft, catalog);
  if (!check.ok) {
    const available = check.errors.some((error) => error.status === "available");
    if (available) {
      return { status: "available", token: getToken(String(draft.name).trim()), errors: check.errors };
    }
    return { status: "rejected", errors: check.errors, helper: check.helper };
  }
  const token = {
    group: String(draft.group).trim(),
    name: String(draft.name).trim(),
    alias: String(draft.alias ?? "").trim(),
    values: { light: String(draft.values.light).trim() },
  };
  for (const [themeId, value] of Object.entries(draft.values ?? {})) {
    if (themeId === "light") continue;
    if (String(value ?? "").trim()) token.values[themeId] = String(value).trim();
  }
  catalog.tokens.push(token);
  const full = validateCatalog(catalog);
  if (!full.ok) return { status: "rejected", errors: full.errors };
  writeCatalog(catalog);
  return { status: "created", token };
}

export function updateToken(name, draft) {
  const catalog = readCatalog();
  const index = catalog.tokens.findIndex((token) => token.name === name);
  if (index < 0) return { status: "missing" };
  const current = catalog.tokens[index];
  const next = {
    group: draft.group != null ? String(draft.group).trim() : current.group,
    name: current.name,
    alias: draft.alias != null ? String(draft.alias).trim() : current.alias,
    values: { ...current.values },
  };
  if (draft.values) {
    for (const [themeId, value] of Object.entries(draft.values)) {
      if (!String(value ?? "").trim()) delete next.values[themeId];
      else next.values[themeId] = String(value).trim();
    }
  }
  if (!next.values.light) return { status: "rejected", errors: [{ field: "values.light", message: "Light value is required." }] };
  const check = validateTokenDraft(next, { tokens: catalog.tokens.filter((token) => token.name !== name) }, { existingName: name });
  if (!check.ok) return { status: "rejected", errors: check.errors, helper: check.helper };
  catalog.tokens[index] = next;
  const full = validateCatalog(catalog);
  if (!full.ok) return { status: "rejected", errors: full.errors };
  writeCatalog(catalog);
  return { status: "updated", token: next };
}

export function deleteToken(name) {
  const catalog = readCatalog();
  if (!catalog.tokens.some((token) => token.name === name)) return { status: "missing" };
  const hits = findNameInUse(name);
  if (hits.length) {
    return { status: "in-use", files: hits.slice(0, 20), fileCount: hits.length };
  }
  catalog.tokens = catalog.tokens.filter((token) => token.name !== name);
  writeCatalog(catalog);
  return { status: "deleted", name };
}
