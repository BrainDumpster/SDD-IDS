import test from "node:test";
import assert from "node:assert/strict";
import { replaceTokenVar, stripCustomProperty, upsertIdsThemeToken } from "./css-export.js";
import { tokenInText } from "../tokens/tokens.js";

const sample = `html[data-design-system="ids"] {
  --color-icon-gray-neutral-accessible: #757575;
}
html[data-design-system="ids"][data-theme="dark"] {
  --color-icon-gray-neutral-accessible: #8898a5;
}
`;

test("adds one token to the light block and removes it again", () => {
  const added = upsertIdsThemeToken("--color-icon-gray-neutral-accessible1", { light: "#ff0101" }, sample);
  assert.match(added, /--color-icon-gray-neutral-accessible1: #ff0101;/);
  assert.equal(added.split("--color-icon-gray-neutral-accessible1").length - 1, 1);
  const removed = stripCustomProperty(added, "--color-icon-gray-neutral-accessible1");
  assert.equal(removed.includes("--color-icon-gray-neutral-accessible1"), false);
  assert.match(removed, /--color-icon-gray-neutral-accessible: #757575;/);
});

test("a spec fallback still counts as a use of the token", () => {
  const spec = "chevron `var(--color-icon-gray-neutral-accessible1, #ff0101)`";
  assert.equal(tokenInText(spec, "--color-icon-gray-neutral-accessible1"), true);
  assert.equal(tokenInText(spec, "--color-icon-gray-neutral-accessible"), false);
});

test("replacement rewrites the name and the fallback to the new token value", () => {
  const text = "color: var(--color-icon-gray-neutral-accessible1, #ff0101); keep var(--color-icon-gray-neutral-accessible); plain var(--color-icon-gray-neutral-accessible1);";
  const next = replaceTokenVar(text, "--color-icon-gray-neutral-accessible1", "--color-icon-gray-neutral-accessible", "#757575");
  assert.equal(
    next,
    "color: var(--color-icon-gray-neutral-accessible, #757575); keep var(--color-icon-gray-neutral-accessible); plain var(--color-icon-gray-neutral-accessible);",
  );
});
