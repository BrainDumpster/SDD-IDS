/**
 * Group names follow the splits already used by
 * scripts/export_ids_foundation_tokens.py, plus the Sizes, Shadows,
 * and component-alias sections in components/ids-theme.css.
 */

import { readCatalog, writeCatalog } from "../tokens/store.js";
import { groupNameProblem } from "../validation/validate.js";

export function primitiveGroup(name) {
  const n = name.startsWith("--") ? name.slice(2) : name;
  const rules = [
    ["alert-", "Alert"],
    ["secondary-palette-", "Secondary Palette"],
    ["ui-palette-", "UI Palette"],
    ["opacity-", "Opacity"],
    ["scale-", "Scale"],
    ["typography-", "Typography"],
    ["ui-icon-spacing-", "UI Icon Spacing"],
    ["white", "White"],
  ];
  for (const [prefix, group] of rules) {
    if (n === prefix.replace(/-$/, "") || n.startsWith(prefix)) return group;
  }
  return "Primitives";
}

export function semanticGroup(name) {
  const n = name.startsWith("--") ? name.slice(2) : name;
  if (n === "annotation") return "Annotation";
  const match = n.match(/^color-([a-z]+)-/);
  if (match) {
    const mapping = {
      background: "Color / Background",
      border: "Color / Border",
      text: "Color / Text",
      icon: "Color / Icon",
      focus: "Color / Focus",
      shadow: "Color / Shadow",
      chart: "Color / Chart",
      link: "Color / Link",
      overlay: "Color / Overlay",
      data: "Color / Data",
      gradient: "Color / Gradient",
      static: "Color / Static",
    };
    return mapping[match[1]] ?? `Color / ${match[1][0].toUpperCase()}${match[1].slice(1)}`;
  }
  if (n.startsWith("shadow-")) return "Shadows";
  if (n.startsWith("icon-")) return "Color / Icon";
  return "Semantic";
}

export function groupForSection(section, name) {
  if (section === "sizes") return "Sizes";
  if (section === "shadows" || section === "shadow-alias") return "Shadows";
  if (section === "component") return "Component layout aliases";
  if (section === "primitive") return primitiveGroup(name);
  return semanticGroup(name);
}

export function listGroups(catalogOrTokens) {
  const tokens = Array.isArray(catalogOrTokens) ? catalogOrTokens : (catalogOrTokens?.tokens ?? []);
  const stored = Array.isArray(catalogOrTokens) ? [] : (catalogOrTokens?.groups ?? []);
  const counts = new Map();
  for (const name of stored) {
    const group = String(name ?? "").trim();
    if (group) counts.set(group, 0);
  }
  for (const token of tokens) {
    counts.set(token.group, (counts.get(token.group) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

function reject(message) {
  return { status: "rejected", errors: [{ field: "name", message }] };
}

export function createGroupRecord(catalog, name) {
  const problem = groupNameProblem(name);
  if (problem) return reject(problem);
  const next = String(name).trim();
  if (listGroups(catalog).some((item) => item.group === next)) return reject("Group already exists.");
  return {
    status: "created",
    group: next,
    catalog: { ...catalog, groups: [...listGroups(catalog).map((item) => item.group), next] },
  };
}

export function renameGroupRecord(catalog, from, to) {
  const current = String(from ?? "").trim();
  const problem = groupNameProblem(to);
  if (problem) return reject(problem);
  const next = String(to).trim();
  const known = listGroups(catalog);
  if (next !== current && known.some((item) => item.group === next)) return reject("Group already exists.");
  if (!known.some((item) => item.group === current)) {
    return { status: "missing", errors: [{ field: "name", message: "Group was not found." }] };
  }
  return {
    status: "updated",
    group: next,
    catalog: {
      ...catalog,
      groups: known.map((item) => (item.group === current ? next : item.group)),
      tokens: (catalog.tokens ?? []).map((token) => (token.group === current ? { ...token, group: next } : token)),
    },
  };
}

export function deleteGroupRecord(catalog, name) {
  const current = String(name ?? "").trim();
  const known = listGroups(catalog);
  const match = known.find((item) => item.group === current);
  if (!match) return { status: "missing" };
  if (match.count > 0) {
    return {
      status: "in-use",
      errors: [{ field: "name", message: `${current} has tokens. Delete is not possible.` }],
    };
  }
  return {
    status: "deleted",
    group: current,
    catalog: { ...catalog, groups: known.map((item) => item.group).filter((group) => group !== current) },
  };
}

export function createGroup(name) {
  const result = createGroupRecord(readCatalog(), name);
  if (result.catalog) writeCatalog(result.catalog);
  return { status: result.status, group: result.group, errors: result.errors };
}

export function renameGroup(from, to) {
  const result = renameGroupRecord(readCatalog(), from, to);
  if (result.catalog) writeCatalog(result.catalog);
  return { status: result.status, group: result.group, errors: result.errors };
}

export function deleteGroup(name) {
  const result = deleteGroupRecord(readCatalog(), name);
  if (result.catalog) writeCatalog(result.catalog);
  return { status: result.status, group: result.group, errors: result.errors };
}
