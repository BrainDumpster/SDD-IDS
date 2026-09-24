import test from "node:test";
import assert from "node:assert/strict";
import { helperText, validateCatalog, validateValue } from "./validate.js";

test("hex and length rules", () => {
  assert.equal(validateValue("#0672cb", "Color / Background", new Set()), null);
  assert.match(validateValue("#12", "Color / Background", new Set()), /hex/);
  assert.equal(validateValue("48px", "Sizes", new Set()), null);
  assert.equal(validateValue("-1px", "Sizes", new Set()), null);
  assert.match(validateValue("2foo", "Sizes", new Set()), /unit/);
  assert.equal(validateValue("0.1", "Opacity", new Set()), null);
  assert.equal(validateValue("'Roboto'", "Typography", new Set()), null);
  assert.equal(validateValue("rgba(37,37,37,0.08)", "Shadows", new Set()), null);
  assert.equal(validateValue("var(--corner-radius-radius-2)", "Component layout aliases", new Set(["--corner-radius-radius-2"])), null);
  assert.match(helperText("Sizes"), /48px/);
});

test("catalog requires one light default", () => {
  const result = validateCatalog({
    themes: [
      { id: "light", label: "Light", default: true },
      { id: "dark", label: "Dark", default: false },
    ],
    tokens: [
      { group: "Sizes", name: "--spacing-space-48", alias: "", values: { light: "48px" } },
      {
        group: "Color / Background",
        name: "--color-background-brand-base",
        alias: "",
        values: { light: "#0672cb", dark: "#509cda" },
      },
    ],
  });
  assert.equal(result.ok, true);
});
