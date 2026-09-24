/**
 * Group names follow the splits already used by
 * scripts/export_ids_foundation_tokens.py, plus the Sizes, Shadows,
 * and component-alias sections in components/ids-theme.css.
 */

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

export function listGroups(tokens) {
  const counts = new Map();
  for (const token of tokens) {
    counts.set(token.group, (counts.get(token.group) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => a.group.localeCompare(b.group));
}
