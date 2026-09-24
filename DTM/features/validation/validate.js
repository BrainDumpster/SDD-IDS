const NAME_RE = /^--[A-Za-z0-9-]+$/;
const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const UNITS = [
  "px",
  "em",
  "rem",
  "%",
  "vh",
  "vw",
  "vmin",
  "vmax",
  "ch",
  "ex",
  "pt",
  "pc",
  "cm",
  "mm",
  "in",
  "s",
  "ms",
  "deg",
  "rad",
  "grad",
  "turn",
];
const LENGTH_RE = new RegExp(
  `^[+-]?(?:\\d+|\\d*\\.\\d+)(?:${UNITS.map((unit) => unit.replace("%", "\\%")).join("|")})$`,
);
const QUOTED_RE = /^(?:'[^']*'|"[^"]*")$/;
const RGB_RE =
  /^rgba?\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;
const HSL_RE =
  /^hsla?\(\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?%\s*,\s*\d+(?:\.\d+)?%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;
const VAR_RE = /^var\(--([A-Za-z0-9-]+)\)$/;
const NUMBER_RE = /^[+-]?(?:\d+|\d*\.\d+)$/;

export function helperText(group) {
  if (group === "Opacity") {
    return "Use a unitless number, as in 0.1.";
  }
  if (group === "Typography") {
    return "Use a quoted string, as in 'Roboto', or a length such as 16px.";
  }
  if (group === "Shadows") {
    return "Use a length (4px), a color (#0672cb or rgba()), var(--existing-name), none, or one box-shadow layer.";
  }
  if (group === "Component layout aliases") {
    return "Use var(--existing-name) or a length such as 2px.";
  }
  if (String(group).startsWith("Color") || group === "Alert" || group === "UI Palette" || group === "Secondary Palette" || group === "White" || group === "Annotation") {
    return "Use a hex color such as #0672cb, or var(--existing-name).";
  }
  return "Use a length such as 48px, a hex color such as #0672cb, or var(--existing-name).";
}

function isLength(value) {
  return LENGTH_RE.test(value);
}

function isColor(value) {
  return HEX_RE.test(value) || RGB_RE.test(value) || HSL_RE.test(value);
}

function isShadowLayer(value) {
  if (value === "none") return true;
  const parts = value.trim().split(/\s+/);
  if (parts.length < 2 || parts.length > 6) return false;
  let index = 0;
  if (parts[0] === "inset") index = 1;
  let lengths = 0;
  while (index < parts.length && isLength(parts[index]) && lengths < 4) {
    lengths += 1;
    index += 1;
  }
  if (lengths < 2) return false;
  if (index === parts.length) return true;
  return isColor(parts.slice(index).join(" "));
}

export function validateValue(value, group, names) {
  const raw = String(value ?? "").trim();
  if (!raw) return "A value is required.";
  if (raw.startsWith("#")) {
    return HEX_RE.test(raw) ? null : "A value that starts with # must be a hex color (#RGB, #RGBA, #RRGGBB, or #RRGGBBAA).";
  }
  const varMatch = raw.match(VAR_RE);
  if (varMatch) {
    const target = `--${varMatch[1]}`;
    if (names && !names.has(target)) {
      return `${target} is not in the catalog.`;
    }
    return null;
  }
  if (QUOTED_RE.test(raw)) return null;
  if (group === "Opacity" && NUMBER_RE.test(raw)) return null;
  if (isLength(raw)) return null;
  if (RGB_RE.test(raw) || HSL_RE.test(raw)) return null;
  if (group === "Shadows" && (raw === "none" || isShadowLayer(raw) || isColor(raw))) return null;
  if (isLength(raw) === false && /[a-z%]+$/i.test(raw) && /^[+-]?(?:\d+|\d*\.\d+)/.test(raw)) {
    return `The unit is not a CSS unit. Use one of: ${UNITS.join(", ")}.`;
  }
  return `Value is not a hex color, a length with a CSS unit, a quoted string, or var(--name). ${helperText(group)}`;
}

function tokenValues(token) {
  return token.values && typeof token.values === "object" ? token.values : {};
}

export function validateCatalog(catalog) {
  const errors = [];
  const themes = Array.isArray(catalog.themes) ? catalog.themes : [];
  const defaults = themes.filter((theme) => theme.default);
  if (defaults.length !== 1) {
    errors.push({ field: "themes", message: "Exactly one theme must be the default." });
  }
  const defaultId = defaults[0]?.id;
  if (defaultId && defaultId !== "light") {
    errors.push({ field: "themes", message: "The default theme id is light." });
  }
  const themeIds = new Set();
  for (const theme of themes) {
    if (!theme.id || !/^[a-z0-9-]+$/.test(theme.id)) {
      errors.push({ field: "themes", message: `Theme id "${theme.id ?? ""}" must be lowercase letters, digits, and hyphens.` });
    } else if (themeIds.has(theme.id)) {
      errors.push({ field: "themes", message: `Theme id "${theme.id}" is already used.` });
    }
    themeIds.add(theme.id);
  }

  const tokens = Array.isArray(catalog.tokens) ? catalog.tokens : [];
  const names = new Set();
  const aliases = new Set();
  for (const token of tokens) {
    if (!NAME_RE.test(token.name ?? "")) {
      errors.push({ field: "name", name: token.name, message: "Name must be -- followed by letters, digits, and hyphens." });
      continue;
    }
    if (names.has(token.name)) {
      errors.push({ field: "name", name: token.name, message: "Name is already in the catalog." });
    }
    names.add(token.name);
    const alias = String(token.alias ?? "").trim();
    if (alias) {
      if (aliases.has(alias) || names.has(alias)) {
        errors.push({ field: "alias", name: token.name, message: "Alias must be unique and must not match a token name." });
      }
      aliases.add(alias);
    }
    const values = tokenValues(token);
    if (!String(values.light ?? "").trim()) {
      errors.push({ field: "values.light", name: token.name, message: "Light value is required." });
    }
    for (const [themeId, value] of Object.entries(values)) {
      if (!themeIds.has(themeId)) {
        errors.push({ field: "values", name: token.name, message: `Theme "${themeId}" is not in the theme list.` });
      }
      const problem = validateValue(value, token.group, null);
      if (problem) {
        errors.push({ field: `values.${themeId}`, name: token.name, message: problem });
      }
    }
  }

  for (const token of tokens) {
    for (const [themeId, value] of Object.entries(tokenValues(token))) {
      const match = String(value).trim().match(VAR_RE);
      if (match && !names.has(`--${match[1]}`)) {
        errors.push({
          field: `values.${themeId}`,
          name: token.name,
          message: `--${match[1]} is not in the catalog.`,
        });
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

export function validateTokenDraft(draft, catalog, { existingName } = {}) {
  const errors = [];
  const name = String(draft.name ?? "").trim();
  if (!NAME_RE.test(name)) {
    errors.push({ field: "name", message: "Name must be -- followed by letters, digits, and hyphens." });
  }
  const alias = String(draft.alias ?? "").trim();
  const names = new Set((catalog.tokens ?? []).map((token) => token.name));
  const aliases = new Set(
    (catalog.tokens ?? []).map((token) => String(token.alias ?? "").trim()).filter(Boolean),
  );
  if (name && names.has(name) && name !== existingName) {
    errors.push({ field: "name", message: "Name is already in the catalog.", status: "available" });
  }
  if (alias) {
    if (alias === name || names.has(alias) || (aliases.has(alias) && alias !== catalog.tokens.find((token) => token.name === existingName)?.alias)) {
      errors.push({ field: "alias", message: "Alias must be unique and must not match a token name." });
    }
  }
  const group = String(draft.group ?? "").trim();
  if (!group) errors.push({ field: "group", message: "Group is required." });
  const values = draft.values && typeof draft.values === "object" ? draft.values : {};
  if (!String(values.light ?? "").trim()) {
    errors.push({ field: "values.light", message: "Light value is required." });
  }
  const known = new Set(names);
  if (name) known.add(name);
  for (const [themeId, value] of Object.entries(values)) {
    if (!String(value ?? "").trim()) continue;
    const problem = validateValue(value, group, known);
    if (problem) errors.push({ field: `values.${themeId}`, message: problem });
  }
  return { ok: errors.length === 0, errors, helper: helperText(group) };
}
