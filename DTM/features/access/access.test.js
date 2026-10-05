import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createApp } from "../../api/server.js";
import {
  SEED_SUPER_ADMINS,
  createUser,
  deleteUser,
  listRoles,
  listUsers,
  loadActor,
  resetAccessForTests,
  updateRoleFlags,
  updateUserRole,
} from "./access.js";

function fresh() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dtm-access-"));
  resetAccessForTests(path.join(dir, "access.sqlite"));
  const previousDev = process.env.DTM_DEV_EMAIL;
  const previousSso = process.env.DTM_REQUIRE_SSO;
  delete process.env.DTM_DEV_EMAIL;
  delete process.env.DTM_REQUIRE_SSO;
  return () => {
    if (previousDev == null) delete process.env.DTM_DEV_EMAIL;
    else process.env.DTM_DEV_EMAIL = previousDev;
    if (previousSso == null) delete process.env.DTM_REQUIRE_SSO;
    else process.env.DTM_REQUIRE_SSO = previousSso;
  };
}

function request({ email, address = "203.0.113.8" } = {}) {
  return {
    get(name) {
      if (String(name).toLowerCase() === "x-auth-request-email") return email;
      return undefined;
    },
    socket: { remoteAddress: address },
  };
}

describe("access", { concurrency: false }, () => {
test("a new database seeds roles and the two super admins", () => {
  const restore = fresh();
  try {
    const roles = listRoles();
    assert.deepEqual(roles.map((role) => role.id).sort(), ["editor", "maintainer", "super_admin", "viewer"]);
    const editor = roles.find((role) => role.id === "editor");
    assert.equal(editor.groups_create, true);
    assert.equal(editor.groups_delete, false);
    assert.equal(editor.tokens_delete, false);
    const viewer = roles.find((role) => role.id === "viewer");
    assert.equal(viewer.groups_read, true);
    assert.equal(viewer.tokens_read, true);
    assert.equal(viewer.tokens_create, false);
    assert.deepEqual(listUsers().map((user) => user.email).sort(), [...SEED_SUPER_ADMINS].sort());
    for (const user of listUsers()) assert.equal(user.roleId, "super_admin");
  } finally {
    restore();
  }
});

test("opening the database again does not duplicate the fixture", () => {
  const restore = fresh();
  try {
    listUsers();
    resetAccessForTests(process.env.DTM_ACCESS_DB);
    assert.equal(listUsers().length, 2);
  } finally {
    restore();
  }
});

test("SSO email must match a stored user, ignoring case", () => {
  const restore = fresh();
  try {
    const actor = loadActor(request({ email: "Patchamuthu.Kandasam@dellteam.com" }));
    assert.equal(actor.kind, "user");
    assert.equal(actor.role.id, "super_admin");
    assert.equal(actor.permissions.manage_users, true);
    const stranger = loadActor(request({ email: "someone@dell.com" }));
    assert.equal(stranger.kind, "denied");
    assert.equal(stranger.email, "someone@dell.com");
  } finally {
    restore();
  }
});

test("editor can add and edit groups and tokens and cannot delete", () => {
  const restore = fresh();
  try {
    const created = createUser({ email: "editor.person@dell.com", roleId: "editor" });
    assert.equal(created.status, "created");
    const actor = loadActor(request({ email: "editor.person@dell.com" }));
    assert.equal(actor.permissions.groups_create, true);
    assert.equal(actor.permissions.groups_update, true);
    assert.equal(actor.permissions.tokens_create, true);
    assert.equal(actor.permissions.tokens_update, true);
    assert.equal(actor.permissions.groups_delete, false);
    assert.equal(actor.permissions.tokens_delete, false);
    assert.equal(actor.permissions.manage_users, false);
  } finally {
    restore();
  }
});

test("seeded super admins cannot be deleted", () => {
  const restore = fresh();
  try {
    assert.equal(listUsers().every((user) => user.seeded), true);
    const blocked = deleteUser("Patchamuthu.Kandasam@dellteam.com");
    assert.equal(blocked.status, "rejected");
    assert.equal(deleteUser(SEED_SUPER_ADMINS[1]).status, "rejected");
    assert.equal(listUsers().length, 2);
    assert.equal(createUser({ email: "extra.person@dell.com", roleId: "viewer" }).status, "created");
    assert.equal(deleteUser("extra.person@dell.com").status, "deleted");
    assert.equal(listUsers().some((user) => user.email === "extra.person@dell.com"), false);
  } finally {
    restore();
  }
});

test("the last person who can manage users stays", () => {
  const restore = fresh();
  try {
    const blocked = updateUserRole(SEED_SUPER_ADMINS[0], "viewer");
    assert.equal(blocked.status, "updated");
    const last = updateUserRole(SEED_SUPER_ADMINS[1], "viewer");
    assert.equal(last.status, "rejected");
    const flags = updateRoleFlags("super_admin", { manage_users: false });
    assert.equal(flags.status, "rejected");
  } finally {
    restore();
  }
});

test("a viewer is blocked from creating a group", async () => {
  const restore = fresh();
  const server = await new Promise((resolve) => {
    const listening = createApp().listen(0, "127.0.0.1", () => resolve(listening));
  });
  try {
    createUser({ email: "view.only@dell.com", roleId: "viewer" });
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/design/groups`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-auth-request-email": "view.only@dell.com",
      },
      body: JSON.stringify({ name: "Should Not Exist" }),
    });
    assert.equal(response.status, 403);
    const me = await fetch(`http://127.0.0.1:${port}/me`, {
      headers: { "x-auth-request-email": "E.Graham@dell.com" },
    });
    const body = await me.json();
    assert.equal(body.allowed, true);
    assert.equal(body.role.id, "super_admin");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    restore();
  }
});

test("loopback scripts are a service actor until SSO is required", () => {
  const restore = fresh();
  try {
    assert.equal(loadActor(request({ address: "127.0.0.1" })).kind, "service");
    process.env.DTM_REQUIRE_SSO = "1";
    assert.equal(loadActor(request({ address: "127.0.0.1" })).kind, "denied");
  } finally {
    restore();
  }
});
});
