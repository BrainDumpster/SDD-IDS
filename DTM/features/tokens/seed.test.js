import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { IDS_THEME_PATH } from "../paths.js";
import { seedCatalogFromCss } from "./seed.js";
import { renderIdsTheme } from "../css-export/css-export.js";

test("seed from ids-theme.css keeps shared names and dark deltas", () => {
  const css = fs.readFileSync(IDS_THEME_PATH, "utf8");
  const catalog = seedCatalogFromCss(css);
  const brand = catalog.tokens.find((token) => token.name === "--color-background-brand-base");
  const spacing = catalog.tokens.find((token) => token.name === "--spacing-space-48");
  assert.ok(brand);
  assert.equal(brand.values.light, "#0672cb");
  assert.equal(brand.values.dark, "#509cda");
  assert.equal(spacing.values.light, "48px");
  assert.equal(spacing.values.dark, undefined);
  const rendered = renderIdsTheme(catalog);
  assert.match(rendered, /--color-background-brand-base: #0672cb;/);
  assert.match(rendered, /data-theme="dark"/);
  assert.match(rendered, /--color-background-brand-base: #509cda;/);
  const darkBlock = rendered.split('data-theme="dark"')[1];
  assert.doesNotMatch(darkBlock, /--spacing-space-48:/);
});
