import tokens from "./foundation-tokens.js";

export { tokens };

const COLOR_VALUE_RE = new RegExp(
  "^(#|rgba?\\(|hsla?\\(|oklch\\(|oklab\\(|lab\\(|lch\\(|color\\()",
  "i",
);

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

export function designTokensOverviewHtml() {
  return `
  <div class="ids-foundations">
    <h1 class="ids-foundations__title">Design tokens</h1>
    <p class="ids-foundations__lede">
      IDS design tokens are CSS custom properties synced from the IDS Variables Library in Figma.
      Use semantic tokens in components; reach for primitives only when building new semantic roles.
    </p>
    ${sourceMetaHtml()}
    <section class="ids-foundations__group">
      <h2 class="ids-foundations__group-title">Token layers</h2>
      <ul class="ids-foundations__list">
        <li><strong>Primitives</strong> — raw palette, opacity, scale, and typography foundations (Figma collection <code>Primitive</code>).</li>
        <li><strong>Semantic</strong> — role-based colors, sizes, and shadow tokens (Figma collections <code>Color Modes</code> and <code>Sizes</code>).</li>
        <li><strong>Components</strong> — shared layout aliases and component-specific shadow aliases consumed by Spec Accurate Design.</li>
        <li><strong>Modes</strong> — how Light and Dark themes apply semantic values at runtime.</li>
      </ul>
    </section>
    <section class="ids-foundations__group">
      <h2 class="ids-foundations__group-title">Usage</h2>
      <p class="ids-foundations__lede">
        Prefer semantic references such as <code>var(--color-background-brand-base)</code>
        instead of primitive hex values. Apply themes with
        <code>data-design-system="ids"</code> and <code>data-theme="light|dark"</code>
        on <code>html</code>/<code>body</code> (Storybook toolbar Theme control).
      </p>
    </section>
  </div>
`;
}

export function designTokensModesHtml() {
  return `
  <div class="ids-foundations">
    <h1 class="ids-foundations__title">Modes</h1>
    <p class="ids-foundations__lede">
      IDS supports Light and Dark color modes. Semantic tokens from the Figma
      <strong>Color Modes</strong> collection resolve to different values per mode while
      Primitive tokens stay constant.
    </p>
    <div class="ids-foundations__modes">
      <article class="ids-foundations__mode-card">
        <h3>Light</h3>
        <p>
          Default mode. Set <code>data-theme="light"</code> (or omit dark).
          Semantic colors come from the light block in <code>components/ids-theme.css</code>.
        </p>
      </article>
      <article class="ids-foundations__mode-card">
        <h3>Dark</h3>
        <p>
          Set <code>data-theme="dark"</code> on <code>html</code>/<code>body</code>
          with <code>data-design-system="ids"</code>. Only semantic (and some shadow) values override;
          primitives and sizes remain shared.
        </p>
      </article>
    </div>
    <section class="ids-foundations__group" style="margin-top:32px">
      <h2 class="ids-foundations__group-title">Storybook</h2>
      <p class="ids-foundations__lede">
        Use the toolbar <strong>Theme</strong> control to switch Light/Dark while browsing
        Spec Accurate Design stories. Semantic token tables under
        <em>Foundations → Design tokens → Semantic</em> list both resolved values side by side.
      </p>
    </section>
  </div>
`;
}

export const DESIGN_TOKEN_PAGES = {
  overview: () => designTokensOverviewHtml(),
  modes: () => designTokensModesHtml(),
  primitives: () =>
    renderNameValueGroups(tokens.primitives, {
      title: "Primitives",
      lede:
        "Primitive tokens are the raw foundation values from the IDS Figma <strong>Primitive</strong> collection. They do not change between light and dark modes. Semantic tokens reference these values.",
      metaHtml: sourceMetaHtml(),
    }),
  semantic: () =>
    renderSemanticGroups(tokens.semantic, {
      title: "Semantic",
      lede:
        "Semantic color tokens from the IDS Figma <strong>Color Modes</strong> collection, plus <strong>Sizes</strong> and <strong>Shadows</strong>. Role-based values resolve differently in Light and Dark where applicable.",
      metaHtml: sourceMetaHtml(),
    }),
  components: () =>
    renderNameValueGroups(tokens.components, {
      title: "Components",
      lede:
        "Component-oriented tokens from the IDS theme — shared layout aliases and component-specific shadow aliases used across Spec Accurate Design components.",
      metaHtml: sourceMetaHtml(),
    }),
};

/** Shared CSF controls for Foundations/Icons (both Storybooks). */
export const ICONS_GALLERY_ARG_TYPES = {
  filter: { control: "text", name: "Filter" },
  limit: {
    control: { type: "number", min: 24, max: 500, step: 24 },
    name: "Max shown",
  },
};

export const ICONS_GALLERY_ARGS = {
  filter: "",
  limit: 120,
};

/**
 * @param {string[]} allIcons
 * @param {{ filter?: string, limit?: number }} args
 */
export function selectIcons(allIcons, args = {}) {
  const list = Array.isArray(allIcons) ? allIcons : [];
  const q = String(args.filter || "")
    .trim()
    .toLowerCase();
  const matched = q ? list.filter((slug) => slug.includes(q)) : list;
  const limit = Math.max(1, Number(args.limit) || 120);
  const icons = matched.slice(0, limit);
  return {
    icons,
    matchedCount: matched.length,
    totalCount: list.length,
    shownCount: icons.length,
    filterLabel: q || "(none)",
  };
}

/**
 * Framework-agnostic Icons gallery HTML (React + Angular both inject this).
 * @param {{ icons: string[], matchedCount: number, totalCount: number, shownCount: number, filterLabel: string, resolveIconUrl: (slug: string) => string, componentHint?: string }} opts
 */
export function renderIconsGalleryHtml({
  icons,
  matchedCount,
  totalCount,
  shownCount,
  filterLabel,
  resolveIconUrl,
  componentHint = "<code>ids-icon</code> / <code>IdsIcon</code>",
}) {
  const tiles = (icons || [])
    .map((icon) => {
      const src = escapeHtml(resolveIconUrl(icon));
      const label = escapeHtml(icon);
      return `
        <div class="ids-foundations__icon-tile">
          <img
            class="ids-foundations__icon-glyph"
            src="${src}"
            width="24"
            height="24"
            alt="${label}"
            title="${label}"
          />
          <span class="ids-foundations__icon-label">${label}</span>
        </div>
      `;
    })
    .join("");

  return `
    <div class="ids-foundations">
      <h1 class="ids-foundations__title">Icons</h1>
      <p class="ids-foundations__lede">
        IDS icon assets from shared <code>assets/icons</code> (repo root;
        GitHub Pages: <code>/&lt;repo&gt;/assets/</code>). Use the slug with
        ${componentHint} or
        <code>idsAssetUrl('icons/&lt;slug&gt;.svg')</code>.
        Filter and limit via the Controls panel.
      </p>
      <div class="ids-foundations__toolbar">
        <span class="ids-foundations__count">
          Filter: <code>${escapeHtml(filterLabel)}</code>
          · Showing ${shownCount} of ${matchedCount} match${matchedCount === 1 ? "" : "es"}
          (${totalCount} total)
        </span>
      </div>
      <div class="ids-foundations__icon-grid">
        ${tiles}
      </div>
    </div>
  `;
}
