import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "../paths.js";
import { readCatalog, writeCatalog } from "./store.js";
import { removeIdsThemeToken, replaceTokenVar, writeIdsThemeToken } from "../css-export/css-export.js";
import { introducingProgramme, invalidateProgrammeUsage, programmeTags } from "../availability/programme-usage.js";
import { listGroups } from "../groups/groups.js";
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

export function tokenInText(text, name) {
  const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`var\\(\\s*${escaped}(?![A-Za-z0-9-])`).test(String(text));
}

export function findNameInUse(name) {
  const files = [];
  walk(path.join(REPO_ROOT, "components"), files);
  const hits = [];
  for (const file of files) {
    if (!file.endsWith(".md") && !file.endsWith(".css")) continue;
    if (file.endsWith(`${path.sep}ids-theme.css`)) continue;
    const text = fs.readFileSync(file, "utf8");
    if (tokenInText(text, name) || (file.endsWith("-theme.css") && text.includes(`${name}:`))) {
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
  return tokens.map((token) => ({ ...present(token, theme), programmes: programmeTags(token) }));
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
  if (!listGroups(catalog).some((item) => item.group === token.group)) {
    return { status: "rejected", errors: [{ field: "group", message: "Create the group before adding tokens." }] };
  }
  const requested = String(draft.introducedBy ?? draft.programme ?? "").trim();
  const introducedBy = requested === "synapse" || requested === "dap" || requested === "powerflex"
    ? requested
    : introducingProgramme(token.name);
  if (introducedBy) token.introducedBy = introducedBy;
  catalog.tokens.push(token);
  const full = validateCatalog(catalog);
  if (!full.ok) return { status: "rejected", errors: full.errors };
  writeCatalog(catalog);
  writeIdsThemeToken(token.name, token.values);
  invalidateProgrammeUsage();
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
  if (current.introducedBy) next.introducedBy = current.introducedBy;
  if (draft.values) {
    for (const [themeId, value] of Object.entries(draft.values)) {
      if (!String(value ?? "").trim()) delete next.values[themeId];
      else next.values[themeId] = String(value).trim();
    }
  }
  if (!next.values.light) return { status: "rejected", errors: [{ field: "values.light", message: "Light value is required." }] };
  const check = validateTokenDraft(next, { tokens: catalog.tokens.filter((token) => token.name !== name) }, { existingName: name });
  if (!check.ok) return { status: "rejected", errors: check.errors, helper: check.helper };
  if (!listGroups(catalog).some((item) => item.group === next.group)) {
    return { status: "rejected", errors: [{ field: "group", message: "Create the group before adding tokens." }] };
  }
  catalog.tokens[index] = next;
  const full = validateCatalog(catalog);
  if (!full.ok) return { status: "rejected", errors: full.errors };
  writeCatalog(catalog);
  writeIdsThemeToken(next.name, next.values);
  invalidateProgrammeUsage();
  return { status: "updated", token: next };
}

function rewriteTokenUses(from, to, fallbackValue) {
  const files = [];
  walk(path.join(REPO_ROOT, "components"), files);
  const changed = [];
  for (const file of files) {
    if (!file.endsWith(".md") && !file.endsWith(".css")) continue;
    if (file.endsWith(`${path.sep}ids-theme.css`)) continue;
    const text = fs.readFileSync(file, "utf8");
    const next = replaceTokenVar(text, from, to, fallbackValue);
    if (next === text) continue;
    fs.writeFileSync(file, next);
    changed.push(path.relative(REPO_ROOT, file));
  }
  return changed;
}

export function deleteToken(name, { replacement } = {}) {
  const catalog = readCatalog();
  const current = String(name ?? "").trim();
  if (!catalog.tokens.some((token) => token.name === current)) return { status: "missing" };
  const nextName = String(replacement ?? "").trim();
  let replaced = [];
  if (nextName) {
    if (!/^--[A-Za-z0-9-]+$/.test(nextName) || nextName === current) {
      return { status: "rejected", errors: [{ field: "replacement", message: "Replacement must be a different token name." }] };
    }
    const replacementToken = catalog.tokens.find((token) => token.name === nextName);
    if (!replacementToken) {
      return { status: "rejected", errors: [{ field: "replacement", message: "Replacement token is not in the catalog." }] };
    }
    replaced = rewriteTokenUses(current, nextName, replacementToken.values.light);
  } else {
    const hits = findNameInUse(current);
    if (hits.length) {
      return { status: "in-use", files: hits.slice(0, 20), fileCount: hits.length };
    }
  }
  catalog.tokens = catalog.tokens.filter((token) => token.name !== current);
  writeCatalog(catalog);
  removeIdsThemeToken(current);
  invalidateProgrammeUsage();
  return { status: "deleted", name: current, replacement: nextName || undefined, replaced };
}
