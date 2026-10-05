import test from "node:test";
import assert from "node:assert/strict";
import { createGroupRecord, deleteGroupRecord, renameGroupRecord } from "./groups.js";

const catalog = {
  groups: ["Sizes"],
  tokens: [{ group: "Sizes", name: "--spacing-space-48", alias: "", values: { light: "48px" } }],
};

test("group create, rename, and delete", () => {
  const created = createGroupRecord(catalog, "Color / Background");
  assert.equal(created.status, "created");
  assert.ok(created.catalog.groups.includes("Color / Background"));

  const invalid = createGroupRecord(catalog, "Color_Background");
  assert.equal(invalid.status, "rejected");

  const renamed = renameGroupRecord(created.catalog, "Color / Background", "Color / Surface");
  assert.equal(renamed.status, "updated");
  assert.equal(renamed.catalog.groups.includes("Color / Surface"), true);

  const duplicate = renameGroupRecord(created.catalog, "Sizes", "Color / Background");
  assert.equal(duplicate.status, "rejected");
  assert.equal(duplicate.errors[0].message, "Group already exists.");

  const blocked = deleteGroupRecord(catalog, "Sizes");
  assert.equal(blocked.status, "in-use");

  const removed = deleteGroupRecord(created.catalog, "Color / Background");
  assert.equal(removed.status, "deleted");
  assert.equal(removed.catalog.groups.includes("Color / Background"), false);
});
