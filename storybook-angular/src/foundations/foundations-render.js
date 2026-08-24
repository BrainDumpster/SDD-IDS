import tokens from "./foundation-tokens.js";

export { tokens };

const COLOR_VALUE_RE =
  /^(#|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|color\()/i;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isColorValue(value) {
  const v = String(value ?? "").trim();
  if (!v) return false;
  return COLOR_VALUE_RE.test(v);
}

function valueCell(value) {
  const raw = String(value ?? "");
  const swatch = isColorValue(raw)
    ? `<span class="ids-foundations__swatch" style="background:${escapeHtml(raw)}" title="${escapeHtml(raw)}"></span>`
    : "";
  return `<div class="ids-foundations__value-cell">${swatch}<span class="ids-foundations__value">${escapeHtml(raw)}</span></div>`;
}

function wrapPage({ title, lede, metaHtml = "", bodyHtml }) {
  return `
    <div class="ids-foundations">
      <h1 class="ids-foundations__title">${escapeHtml(title)}</h1>
      <p class="ids-foundations__lede">${lede}</p>
      ${metaHtml}
      ${bodyHtml}
    </div>
  `;
}

export function renderNameValueGroups(groups, { title, lede, metaHtml = "" }) {
  const bodyHtml = (groups || [])
    .map((group) => {
      const rows = (group.tokens || [])
        .map(
          (token) => `
            <tr>
              <td class="ids-foundations__name">${escapeHtml(token.name)}</td>
              <td>${valueCell(token.value)}</td>
            </tr>
          `,
        )
        .join("");
      return `
        <section class="ids-foundations__group">
          <h2 class="ids-foundations__group-title">${escapeHtml(group.group)}</h2>
          <table class="ids-foundations__table">
            <thead>
              <tr><th>Name</th><th>Value</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </section>
      `;
    })
    .join("");

  return wrapPage({ title, lede, metaHtml, bodyHtml });
}

export function renderSemanticGroups(groups, { title, lede, metaHtml = "" }) {
  const bodyHtml = (groups || [])
    .map((group) => {
      const rows = (group.tokens || [])
        .map(
          (token) => `
            <tr>
              <td class="ids-foundations__name">${escapeHtml(token.name)}</td>
              <td>${valueCell(token.light)}</td>
              <td>${valueCell(token.dark)}</td>
            </tr>
          `,
        )
        .join("");
      return `
        <section class="ids-foundations__group">
          <h2 class="ids-foundations__group-title">${escapeHtml(group.group)}</h2>
          <table class="ids-foundations__table">
            <thead>
              <tr><th>Name</th><th>Light</th><th>Dark</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </section>
      `;
    })
    .join("");

  return wrapPage({ title, lede, metaHtml, bodyHtml });
}

export function sourceMetaHtml() {
  const lib = tokens?.source?.variablesLibrary || "";
  const theme = tokens?.source?.themeCss || "components/ids-theme.css";
  return `
    <div class="ids-foundations__meta">
      Values are resolved from <code>${escapeHtml(theme)}</code>
      (Figma IDS Variables Library collections
      <code>Primitive</code> and <code>Color Modes</code>).
      ${lib ? `Library: <a href="${escapeHtml(lib)}" target="_blank" rel="noreferrer">IDS Variables Library</a>.` : ""}
      Regenerate with <code>python3 scripts/export_ids_foundation_tokens.py</code>.
    </div>
  `;
}

export function foundationsDocsStory(html) {
  return {
    parameters: {
      layout: "fullscreen",
      controls: { disable: true },
      actions: { disable: true },
      docs: {
        source: { code: null },
      },
    },
    render: () => ({
      template: html,
    }),
  };
}
