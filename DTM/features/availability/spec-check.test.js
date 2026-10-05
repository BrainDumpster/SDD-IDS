import test from "node:test";
import assert from "node:assert/strict";
import { classifyResults, extractTokenNames, offlineMessage, programmeSummary } from "./spec-check.js";

test("extracts unique token names from a spec", () => {
  const names = extractTokenNames("color: var(--color-text-gray-white); again var(--color-text-gray-white); var(--modal-control-radius)\n---\n");
  assert.deepEqual(names, ["--color-text-gray-white", "--modal-control-radius"]);
});

test("classifies resolve results", () => {
  const buckets = classifyResults([
    { name: "--color-text-gray-white", status: "available" },
    { name: "--spacing-xxl", status: "missing" },
    { name: "--modal-control-radius", status: "programme_local" },
  ]);
  assert.deepEqual(buckets.available, ["--color-text-gray-white"]);
  assert.deepEqual(buckets.missing, ["--spacing-xxl"]);
  assert.deepEqual(buckets.programmeLocal, ["--modal-control-radius"]);
});

test("programme summary keeps counts only", () => {
  const rows = programmeSummary([
    { programme: "dap", file: "components/dap-theme.css", counts: { "in-sync": 1, override: 2, "programme-local": 0, missing: 3 }, findings: [{ name: "--a" }] },
  ]);
  assert.equal(rows[0].findings, undefined);
  assert.equal(rows[0].counts.override, 2);
});

test("offline message tells the user how to check later", () => {
  const text = offlineMessage();
  assert.match(text, /not running/);
  assert.match(text, /Programme check/);
  assert.match(text, /ids-theme\.css/);
});
