import test from "node:test";
import assert from "node:assert/strict";
import { addProgrammeUsage, introducingProgramme, programmeFromPath, programmeTags } from "./programme-usage.js";

test("paths map to programmes", () => {
  assert.equal(programmeFromPath("components/ids-theme.css"), "ids");
  assert.equal(programmeFromPath("components/ids/accordion/design-spec.md"), "ids");
  assert.equal(programmeFromPath("components/synapse-theme.css"), "synapse");
  assert.equal(programmeFromPath("components/synapse/modal/design-spec.md"), "synapse");
  assert.equal(programmeFromPath("components/dap-theme.css"), "dap");
  assert.equal(programmeFromPath("components/powerflex-theme.css"), "powerflex");
  assert.equal(programmeFromPath("components/other.css"), null);
});

test("tags are IDS plus the single introducing programme", () => {
  assert.deepEqual(programmeTags({}), ["ids"]);
  assert.deepEqual(programmeTags({ introducedBy: "synapse" }), ["ids", "synapse"]);
  assert.deepEqual(programmeTags({ introducedBy: "ids" }), ["ids"]);
});

test("a name used by more than one programme has no single introducer", () => {
  assert.equal(introducingProgramme("--color-background-brand-base"), null);
});

test("a token reference adds that programme", () => {
  const usage = new Map();
  addProgrammeUsage(usage, "ids", "color: var(--color-icon-gray-neutral-accessible);");
  addProgrammeUsage(usage, "synapse", "color: var(--color-icon-gray-neutral-accessible);");
  assert.deepEqual([...usage.get("--color-icon-gray-neutral-accessible")], ["ids", "synapse"]);
});
