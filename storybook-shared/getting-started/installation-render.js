/**
 * Getting Started → Installation HTML for React and Angular Storybooks.
 * Framework-specific copy; shared page chrome via `.ids-foundations` styles.
 */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function codeBlock(code, lang = "") {
  const label = lang ? ` data-lang="${escapeHtml(lang)}"` : "";
  return `<pre class="ids-foundations__code"${label}><code>${escapeHtml(code.trim())}</code></pre>`;
}

function section(title, bodyHtml) {
  return `
    <section class="ids-foundations__group">
      <h2 class="ids-foundations__group-title">${escapeHtml(title)}</h2>
      ${bodyHtml}
    </section>
  `;
}

function wrapPage({ title, lede, bodyHtml }) {
  return `
    <div class="ids-foundations">
      <h1 class="ids-foundations__title">${escapeHtml(title)}</h1>
      <p class="ids-foundations__lede">${lede}</p>
      ${bodyHtml}
    </div>
  `;
}

function checklist(items) {
  const lis = items.map((item) => `<li>${item}</li>`).join("");
  return `<ul class="ids-foundations__list">${lis}</ul>`;
}

/** Shared theme / document attributes guidance (same for both frameworks). */
function themeCssSections({ globalImportExample, stylesEntryHint }) {
  return [
    section(
      "1. Theme CSS (required)",
      `
      <p>IDS components resolve all colors, spacing, typography, and radius through CSS variables.
      Load the theme <strong>once globally</strong> — do not import it inside individual component files.</p>
      <div class="ids-foundations__meta">
        <strong>Canonical file:</strong> <code>components/ids-theme.css</code><br/>
        Tokens are scoped to <code>html[data-design-system="ids"]</code> /
        <code>body[data-design-system="ids"]</code>.
        Dark mode uses the same attribute pair plus <code>data-theme="dark"</code>
        (or the <code>.ids-theme-dark</code> class where documented).
      </div>
      <p>${stylesEntryHint}</p>
      ${codeBlock(globalImportExample, "css")}
      <p>Also set the design-system attribute on the document (typically in <code>index.html</code> or your app bootstrap):</p>
      ${codeBlock(
        `<html data-design-system="ids" data-theme="light">
  <body>
    <!-- app root -->
  </body>
</html>`,
        "html",
      )}
      <p>Toggle dark mode by setting <code>data-theme="dark"</code> on <code>html</code> and/or <code>body</code>
      (match what Storybook’s Theme toolbar does).</p>
      `,
    ),
    section(
      "2. Programme theme overlays (optional)",
      `
      <p>If the host app uses a programme layered on IDS, load the programme theme
      <strong>after</strong> <code>ids-theme.css</code> and set the matching
      <code>data-design-system</code> value:</p>
      <table class="ids-foundations__table">
        <thead>
          <tr><th>Programme</th><th>Theme CSS</th><th>Attribute</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>IDS (default)</td>
            <td><code>components/ids-theme.css</code></td>
            <td><code>data-design-system="ids"</code></td>
          </tr>
          <tr>
            <td>DAP</td>
            <td><code>ids-theme.css</code> + <code>components/dap-theme.css</code></td>
            <td><code>data-design-system="dap"</code></td>
          </tr>
          <tr>
            <td>Synapse</td>
            <td><code>components/synapse-theme.css</code></td>
            <td><code>data-design-system="synapse"</code></td>
          </tr>
        </tbody>
      </table>
      <p>Do <strong>not</strong> hardcode hex / px values in app styles that target IDS components —
      use semantic <code>var(--…)</code> tokens from the theme.</p>
      `,
    ),
  ].join("");
}

/**
 * @returns {string}
 */
export function renderReactInstallationHtml() {
  const bodyHtml = [
    section(
      "What you are installing",
      `
      <p>The IDS <strong>React</strong> component library lives under <code>lib/react/ids/</code>.
      Storybook resolves the public import scope <code>@ids/react/&lt;slug&gt;</code> to that folder.
      Point your app’s bundler (Vite / Webpack / TypeScript <code>paths</code>) at the same mapping,
      or consume the package once it is published under that scope.</p>
      ${checklist([
        "React 18+ (Storybook uses React 19)",
        "CSS Modules support (<code>*.module.css</code> ships with each component)",
        "Access to repo <code>components/ids-theme.css</code> and <code>assets/icons/</code>",
      ])}
      `,
    ),
    themeCssSections({
      stylesEntryHint:
        "Import the theme into the application’s <strong>main stylesheet</strong> or entry module (for example <code>src/index.css</code>, <code>src/main.tsx</code>, or <code>src/App.tsx</code>):",
      globalImportExample: `/* src/index.css — or import from main.tsx */
@import url("../path/to/components/ids-theme.css");

/* Or in the JS/TS entry: */
/* import "../path/to/components/ids-theme.css"; */`,
    }),
    section(
      "3. Import components",
      `
      <p>Import from the component slug under <code>@ids/react</code>. Prefer the per-component
      entry (tree-shakeable) over a barrel import when possible.</p>
      ${codeBlock(
        `import { IdsButton, IdsButtonLabel } from "@ids/react/button";
import { IdsIcon } from "@ids/react/icon";

export function SaveAction() {
  return (
    <IdsButton variant="primary" size="large">
      <IdsButtonLabel>Save</IdsButtonLabel>
    </IdsButton>
  );
}`,
        "tsx",
      )}
      <p>Example TypeScript path mapping (Vite / <code>tsconfig.json</code>):</p>
      ${codeBlock(
        `{
  "compilerOptions": {
    "paths": {
      "@ids/react": ["../lib/react/ids"],
      "@ids/react/*": ["../lib/react/ids/*"]
    }
  }
}`,
        "json",
      )}
      <p>Public React names are <code>Ids</code> + PascalCase anatomy
      (for example <code>IdsButton</code>, <code>IdsModalHeader</code>).
      Do not use dotted compound selection as the public API.</p>
      `,
    ),
    section(
      "4. Icons",
      `
      <p>Use the shared <code>IdsIcon</code> component. The <code>shape</code> prop is the icon slug —
      the file name under <code>assets/icons/</code> without <code>.svg</code>.</p>
      ${codeBlock(
        `import { IdsIcon } from "@ids/react/icon";

<IdsIcon
  shape="chev-down-thick"
  size={16}
  color="var(--color-icon-gray-neutral-base)"
/>

{/* Full-color status glyphs */}
<IdsIcon shape="status-critical-square-solid" variant="img" size={16} />`,
        "tsx",
      )}
      <div class="ids-foundations__meta">
        <strong>Asset resolution:</strong> React <code>IdsIcon</code> bundles SVGs via
        <code>import.meta.glob</code> against <code>assets/icons/*.svg</code>.
        Keep that folder on the module graph (monorepo path or package assets).
        Browse slugs under <strong>Foundations → Icons</strong>.
      </div>
      <ul class="ids-foundations__list">
        <li><code>variant="mask"</code> (default) — tintable with <code>color</code> / <code>currentColor</code></li>
        <li><code>variant="img"</code> — full-color SVG</li>
        <li><code>variant="inline"</code> — curated two-tone DOM SVG when registered</li>
      </ul>
      `,
    ),
    section(
      "5. Component styles",
      `
      <p>Each React component ships a co-located <code>*.module.css</code> file.
      Your bundler must process CSS Modules. You do <strong>not</strong> import those files
      yourself — importing the component loads its styles.</p>
      <p>App-level layout may use IDS tokens (for example
      <code>background: var(--color-background-surface-1)</code>) once the theme is loaded.</p>
      `,
    ),
    section(
      "Verify",
      checklist([
        "<code>ids-theme.css</code> is imported in the app’s main style / entry (not only Storybook)",
        "<code>data-design-system=\"ids\"</code> is set on <code>html</code> or <code>body</code>",
        "A sample component renders with token-backed colors (inspect computed CSS variables)",
        "An <code>IdsIcon</code> with a known <code>shape</code> shows a glyph (not an empty box)",
        "Dark mode flips when <code>data-theme=\"dark\"</code> is set",
      ]),
    ),
  ].join("");

  return wrapPage({
    title: "Installation",
    lede:
      "Wire the IDS React library into a host application: global theme CSS, document attributes, component imports, and icons.",
    bodyHtml,
  });
}

/**
 * @returns {string}
 */
export function renderAngularInstallationHtml() {
  const bodyHtml = [
    section(
      "What you are installing",
      `
      <p>The IDS <strong>Angular</strong> component library lives under <code>lib/angular/ids/</code>
      (Storybook serves the compiled output under <code>storybook-angular/compiled/lib/angular/ids/</code>).
      Public imports use the scope <code>@ids/angular/&lt;slug&gt;</code>.</p>
      ${checklist([
        "Angular 17+ with <strong>standalone</strong> components",
        "SCSS / component styles enabled (each port ships <code>*.component.scss</code>)",
        "Global access to <code>components/ids-theme.css</code> and static <code>assets/icons/</code>",
      ])}
      `,
    ),
    themeCssSections({
      stylesEntryHint:
        "Add the theme to the application’s <strong>global styles</strong> — prefer <code>angular.json</code> <code>styles</code> (or <code>styles.scss</code> imported from there), not a component’s <code>styleUrl</code>:",
      globalImportExample: `/* src/styles.scss — listed in angular.json → projects.*.architect.build.options.styles */
@import "../path/to/components/ids-theme.css";

/* Or in angular.json:
  "styles": [
    "src/styles.scss",
    "../path/to/components/ids-theme.css"
  ]
*/`,
    }),
    section(
      "3. Import components",
      `
      <p>Each Angular slug exports an <code>IDS_*_IMPORTS</code> array (root + required children such as
      <code>IdsIconComponent</code>). Spread that array into the host standalone component’s
      <code>imports</code>.</p>
      ${codeBlock(
        `import { Component } from "@angular/core";
import { IDS_BUTTON_IMPORTS } from "@ids/angular/button";

@Component({
  standalone: true,
  selector: "app-save-action",
  imports: [...IDS_BUTTON_IMPORTS],
  template: \`
    <ids-button variant="primary" size="large">
      Save
    </ids-button>
  \`,
})
export class SaveActionComponent {}`,
        "ts",
      )}
      <p>Example TypeScript path mapping:</p>
      ${codeBlock(
        `{
  "compilerOptions": {
    "paths": {
      "@ids/angular": ["./path/to/lib/angular/ids"],
      "@ids/angular/*": ["./path/to/lib/angular/ids/*"]
    }
  }
}`,
        "json",
      )}
      <p>Selectors follow kebab-case anatomy (<code>ids-button</code>, <code>ids-modal</code>,
      <code>ids-checkbox-group</code>). Prefer composition (group + projected children) where the
      design-spec documents it.</p>
      `,
    ),
    section(
      "4. Icons",
      `
      <p>Use <code>&lt;ids-icon&gt;</code> (<code>IdsIconComponent</code>). Bind
      <code>shape</code> (or alias <code>shapeName</code>) to the slug matching
      <code>assets/icons/&lt;slug&gt;.svg</code>.</p>
      ${codeBlock(
        `import { IDS_ICON_IMPORTS } from "@ids/angular/icon";

@Component({
  standalone: true,
  imports: [...IDS_ICON_IMPORTS],
  template: \`
    <ids-icon
      shape="chev-down-thick"
      [size]="16"
      color="var(--color-icon-gray-neutral-base)"
    />

    <ids-icon
      shape="status-critical-square-solid"
      variant="img"
      [size]="16"
    />
  \`,
})
export class IconExampleComponent {}`,
        "ts",
      )}
      <div class="ids-foundations__meta">
        <strong>Asset resolution:</strong> Angular icons load from
        <code>/assets/icons/&lt;shape&gt;.svg</code> (see <code>idsAssetUrl</code>).
        Serve the repo <code>assets/</code> folder as static files — for example
        <code>angular.json</code> <code>assets</code> entries, or copy/symlink
        <code>assets/icons</code> into the app’s public assets.
        Browse slugs under <strong>Foundations → Icons</strong>.
      </div>
      <ul class="ids-foundations__list">
        <li><code>variant="mask"</code> (default) — tintable glyph</li>
        <li><code>variant="img"</code> — full-color SVG</li>
        <li>Many feature barrels already include <code>IdsIconComponent</code> via <code>IDS_*_IMPORTS</code></li>
      </ul>
      `,
    ),
    section(
      "5. Component styles",
      `
      <p>Angular ports use co-located <code>*.component.scss</code> with
      <code>ViewEncapsulation.None</code> where the design system requires global class hooks.
      Importing the component (via <code>IDS_*_IMPORTS</code>) pulls those styles — do not re-declare
      component SCSS in the host app.</p>
      <p>Keep theme CSS global; keep component SCSS with the library.</p>
      `,
    ),
    section(
      "Verify",
      checklist([
        "<code>ids-theme.css</code> appears in global <code>styles</code> / <code>styles.scss</code>",
        "<code>data-design-system=\"ids\"</code> is set on <code>html</code> or <code>body</code>",
        "A sample <code>ids-*</code> control renders with token-backed colors",
        "<code>assets/icons</code> is reachable (an <code>ids-icon</code> shows a glyph)",
        "Dark mode flips when <code>data-theme=\"dark\"</code> is set",
      ]),
    ),
  ].join("");

  return wrapPage({
    title: "Installation",
    lede:
      "Wire the IDS Angular library into a host application: global theme CSS, document attributes, component imports, and icons.",
    bodyHtml,
  });
}
