import { listGroups } from "../groups/groups.js";
import { listTokens, getToken, createToken } from "../tokens/tokens.js";
import { readCatalog } from "../tokens/store.js";
import { valueFor } from "../themes/themes.js";

const COMPONENT_ALIAS = /^--[a-z0-9]+(?:-[a-z0-9]+)*-(?:control-radius|focus-ring-radius|focus-ring-offset|label-font-weight|min-width)$/;

export function availability({ group, q, theme } = {}) {
  const catalog = readCatalog();
  const tokens = listTokens({ group, q, theme });
  return {
    theme: theme || "light",
    groups: listGroups(catalog.tokens),
    tokens,
  };
}

export function resolveNames({ names, programme, theme, createMissing, drafts }) {
  const catalog = readCatalog();
  const results = [];
  for (const raw of names ?? []) {
    const name = String(raw).trim();
    const existing = catalog.tokens.find((token) => token.name === name);
    if (existing) {
      const shown = valueFor(existing, theme);
      results.push({ name, status: "available", token: existing, ...shown });
      continue;
    }
    if (COMPONENT_ALIAS.test(name)) {
      results.push({ name, status: "programme_local", programme: programme ?? null });
      continue;
    }
    if (createMissing) {
      const draft = (drafts ?? []).find((item) => item.name === name);
      if (!draft?.values?.light || !draft.group) {
        results.push({
          name,
          status: "rejected",
          errors: [{ field: "values.light", message: "A new common token needs a group and a light value." }],
        });
        continue;
      }
      const created = createToken(draft);
      results.push({ name, ...created });
      continue;
    }
    results.push({ name, status: "missing" });
  }
  return results;
}

export function lookup(name) {
  const token = getToken(name);
  if (!token) return null;
  return token;
}
