import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { DTM_ROOT } from "../paths.js";

/** Inserted only when the user table is empty, so a new installation has both super admins. */
export const SEED_SUPER_ADMINS = [
  "patchamuthu.kandasam@dellteam.com",
  "e.graham@dell.com",
];

export const FLAG_KEYS = [
  "groups_create",
  "groups_read",
  "groups_update",
  "groups_delete",
  "tokens_create",
  "tokens_read",
  "tokens_update",
  "tokens_delete",
  "manage_users",
];

const ROLE_SEED = [
  ["viewer", "Viewer", 0, 1, 0, 0, 0, 1, 0, 0, 0],
  ["editor", "Editor", 1, 1, 1, 0, 1, 1, 1, 0, 0],
  ["maintainer", "Maintainer", 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ["super_admin", "Super admin", 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let db;

export function accessDbPath() {
  return process.env.DTM_ACCESS_DB || path.join(DTM_ROOT, "records", "access.sqlite");
}

export function resetAccessForTests(filePath) {
  if (db) db.close();
  db = null;
  if (filePath) process.env.DTM_ACCESS_DB = filePath;
}

export function ensureAccess() {
  database();
}

function database() {
  if (db) return db;
  const filePath = accessDbPath();
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  db = new DatabaseSync(filePath);
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      groups_create INTEGER NOT NULL,
      groups_read INTEGER NOT NULL,
      groups_update INTEGER NOT NULL,
      groups_delete INTEGER NOT NULL,
      tokens_create INTEGER NOT NULL,
      tokens_read INTEGER NOT NULL,
      tokens_update INTEGER NOT NULL,
      tokens_delete INTEGER NOT NULL,
      manage_users INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      role_id TEXT NOT NULL REFERENCES roles(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  seed(db);
  return db;
}

function seed(databaseHandle) {
  const insertRole = databaseHandle.prepare(`
    INSERT OR IGNORE INTO roles (
      id, name,
      groups_create, groups_read, groups_update, groups_delete,
      tokens_create, tokens_read, tokens_update, tokens_delete,
      manage_users
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertUser = databaseHandle.prepare(`
    INSERT OR IGNORE INTO users (email, role_id, created_at, updated_at)
    VALUES (?, 'super_admin', ?, ?)
  `);
  const now = new Date().toISOString();
  databaseHandle.exec("BEGIN");
  try {
    for (const role of ROLE_SEED) insertRole.run(...role);
    const existing = databaseHandle.prepare("SELECT COUNT(*) AS n FROM users").get();
    if (!existing.n) {
      for (const email of SEED_SUPER_ADMINS) insertUser.run(email, now, now);
    }
    databaseHandle.exec("COMMIT");
  } catch (error) {
    databaseHandle.exec("ROLLBACK");
    throw error;
  }
}

export function normalizeEmail(value) {
  const email = String(value ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email;
}

function permissionsOf(row) {
  return Object.fromEntries(FLAG_KEYS.map((key) => [key, Boolean(row[key])]));
}

function publicRole(row) {
  return { id: row.id, name: row.name, ...permissionsOf(row) };
}

function publicUser(row) {
  return {
    email: row.email,
    roleId: row.role_id,
    roleName: row.role_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    seeded: SEED_SUPER_ADMINS.includes(row.email),
  };
}

const USER_SQL = `
  SELECT users.email, users.role_id, users.created_at, users.updated_at, roles.name AS role_name,
    roles.groups_create, roles.groups_read, roles.groups_update, roles.groups_delete,
    roles.tokens_create, roles.tokens_read, roles.tokens_update, roles.tokens_delete,
    roles.manage_users
  FROM users
  JOIN roles ON roles.id = users.role_id
`;

export function listRoles() {
  return database().prepare("SELECT * FROM roles ORDER BY name").all().map(publicRole);
}

export function listUsers() {
  return database().prepare(`${USER_SQL} ORDER BY users.email`).all().map(publicUser);
}

function userRow(email) {
  return database().prepare(`${USER_SQL} WHERE users.email = ?`).get(email);
}

export function createUser({ email, roleId = "viewer" } = {}) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { status: "rejected", errors: [{ field: "email", message: "Enter a valid email address." }] };
  }
  const role = database().prepare("SELECT id FROM roles WHERE id = ?").get(roleId || "viewer");
  if (!role) return { status: "rejected", errors: [{ field: "roleId", message: "Choose a role." }] };
  if (userRow(normalized)) {
    return { status: "rejected", errors: [{ field: "email", message: "That email is already in DTM." }] };
  }
  const now = new Date().toISOString();
  database().prepare("INSERT INTO users (email, role_id, created_at, updated_at) VALUES (?, ?, ?, ?)").run(normalized, role.id, now, now);
  return { status: "created", user: publicUser(userRow(normalized)) };
}

export function updateUserRole(email, roleId) {
  const normalized = normalizeEmail(email);
  const current = normalized ? userRow(normalized) : undefined;
  if (!current) return { status: "missing", errors: [{ field: "email", message: "That person is not in DTM." }] };
  const next = database().prepare("SELECT * FROM roles WHERE id = ?").get(roleId);
  if (!next) return { status: "rejected", errors: [{ field: "roleId", message: "Choose a role." }] };
  if (current.manage_users && !next.manage_users) {
    const others = otherManagers(normalized);
    if (!others.n) {
      return { status: "rejected", errors: [{ message: "DTM needs one person who can manage users." }] };
    }
  }
  const now = new Date().toISOString();
  database().prepare("UPDATE users SET role_id = ?, updated_at = ? WHERE email = ?").run(next.id, now, normalized);
  return { status: "updated", user: publicUser(userRow(normalized)) };
}

function otherManagers(email) {
  return database().prepare(`
    SELECT COUNT(*) AS n FROM users
    JOIN roles ON roles.id = users.role_id
    WHERE roles.manage_users = 1 AND users.email != ?
  `).get(email);
}

export function deleteUser(email) {
  const normalized = normalizeEmail(email);
  const current = normalized ? userRow(normalized) : undefined;
  if (!current) return { status: "missing", errors: [{ field: "email", message: "That person is not in DTM." }] };
  if (SEED_SUPER_ADMINS.includes(normalized)) {
    return { status: "rejected", errors: [{ message: "A seeded super admin cannot be deleted." }] };
  }
  if (current.manage_users && !otherManagers(normalized).n) {
    return { status: "rejected", errors: [{ message: "DTM needs one person who can manage users." }] };
  }
  database().prepare("DELETE FROM users WHERE email = ?").run(normalized);
  return { status: "deleted", email: normalized };
}

export function updateRoleFlags(roleId, patch = {}) {
  const current = database().prepare("SELECT * FROM roles WHERE id = ?").get(roleId);
  if (!current) return { status: "missing", errors: [{ message: "That role does not exist." }] };
  const next = { ...current };
  for (const key of FLAG_KEYS) {
    if (patch[key] == null) continue;
    next[key] = patch[key] ? 1 : 0;
  }
  if (current.manage_users && !next.manage_users) {
    const others = database().prepare("SELECT COUNT(*) AS n FROM roles WHERE manage_users = 1 AND id != ?").get(roleId);
    if (!others.n) {
      return { status: "rejected", errors: [{ message: "Keep manage users on at least one role." }] };
    }
  }
  database().prepare(`
    UPDATE roles SET
      groups_create = ?, groups_read = ?, groups_update = ?, groups_delete = ?,
      tokens_create = ?, tokens_read = ?, tokens_update = ?, tokens_delete = ?,
      manage_users = ?
    WHERE id = ?
  `).run(
    next.groups_create,
    next.groups_read,
    next.groups_update,
    next.groups_delete,
    next.tokens_create,
    next.tokens_read,
    next.tokens_update,
    next.tokens_delete,
    next.manage_users,
    roleId,
  );
  return { status: "updated", role: publicRole(database().prepare("SELECT * FROM roles WHERE id = ?").get(roleId)) };
}

function headerEmail(req) {
  const header = req.get?.("x-auth-request-email") || req.get?.("x-forwarded-email") || "";
  return normalizeEmail(header);
}

function isLoopback(req) {
  const address = req.socket?.remoteAddress ?? "";
  return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}

export function loadActor(req) {
  ensureAccess();
  const requireSso = process.env.DTM_REQUIRE_SSO === "1";
  const header = headerEmail(req);
  const dev = !requireSso ? normalizeEmail(process.env.DTM_DEV_EMAIL) : "";
  const email = header || dev;
  if (email) {
    const row = userRow(email);
    if (!row) return { kind: "denied", email };
    return {
      kind: "user",
      email,
      role: { id: row.role_id, name: row.role_name },
      permissions: permissionsOf(row),
    };
  }
  if (!requireSso && isLoopback(req)) return { kind: "service", email: null };
  return { kind: "denied", email: null };
}

export function publicMe(actor) {
  if (actor.kind !== "user") {
    return {
      allowed: false,
      email: actor.email,
      message: actor.email
        ? "This email is not allowed into DTM."
        : "Dell SSO did not provide an email.",
    };
  }
  return {
    allowed: true,
    email: actor.email,
    role: actor.role,
    permissions: actor.permissions,
  };
}

/** `ok` proceeds. `forbidden` is a known user missing the flag. `denied` is not in DTM. Service may change groups and tokens, not users. */
export function authorize(actor, permission) {
  if (actor.kind === "service") return permission === "manage_users" ? "forbidden" : "ok";
  if (actor.kind !== "user") return "denied";
  if (permission && !actor.permissions[permission]) return "forbidden";
  return "ok";
}
