import express from "express";
import { authorize, createUser, deleteUser, ensureAccess, listRoles, listUsers, loadActor, publicMe, updateRoleFlags, updateUserRole } from "../features/access/access.js";
import { availability, resolveNames } from "../features/availability/availability.js";
import { buildIdsTheme, patchProgrammeToken, validateProgrammeFiles } from "../features/css-export/css-export.js";
import { createGroup, deleteGroup, listGroups, renameGroup } from "../features/groups/groups.js";
import { createTheme, deleteTheme, listThemes } from "../features/themes/themes.js";
import { createToken, deleteToken, getToken, listTokens, updateToken } from "../features/tokens/tokens.js";
import { normalizeCatalog, readCatalog } from "../features/tokens/store.js";
import { helperText } from "../features/validation/validate.js";

function sendDecision(res, actor, decision) {
  if (decision === "ok") return false;
  if (decision === "forbidden") {
    res.status(403).json({ status: "forbidden", errors: [{ message: "Your role cannot do that." }] });
    return true;
  }
  const message = actor.email
    ? "This email is not allowed into DTM."
    : "Dell SSO did not provide an email.";
  res.status(actor.email ? 403 : 401).json({ status: "denied", email: actor.email, errors: [{ message }] });
  return true;
}

function allow(req, res, permission) {
  const actor = loadActor(req);
  return !sendDecision(res, actor, authorize(actor, permission));
}

function allowAny(req, res, permissions) {
  const actor = loadActor(req);
  if (actor.kind === "service") return true;
  if (actor.kind !== "user") return !sendDecision(res, actor, "denied");
  if (permissions.some((permission) => actor.permissions[permission])) return true;
  return !sendDecision(res, actor, "forbidden");
}

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/me", (req, res) => {
    res.json(publicMe(loadActor(req)));
  });

  app.get("/admin/roles", (req, res) => {
    if (!allow(req, res, "manage_users")) return;
    res.json({ roles: listRoles() });
  });

  app.patch("/admin/roles/:id", (req, res) => {
    if (!allow(req, res, "manage_users")) return;
    const result = updateRoleFlags(req.params.id, req.body ?? {});
    const code = result.status === "missing" ? 404 : result.status === "rejected" ? 400 : 200;
    res.status(code).json(result);
  });

  app.get("/admin/users", (req, res) => {
    if (!allow(req, res, "manage_users")) return;
    res.json({ users: listUsers() });
  });

  app.post("/admin/users", (req, res) => {
    if (!allow(req, res, "manage_users")) return;
    const result = createUser({ email: req.body?.email, roleId: req.body?.roleId });
    res.status(result.status === "rejected" ? 400 : 200).json(result);
  });

  app.patch("/admin/users/:email", (req, res) => {
    if (!allow(req, res, "manage_users")) return;
    const result = updateUserRole(req.params.email, req.body?.roleId);
    const code = result.status === "missing" ? 404 : result.status === "rejected" ? 400 : 200;
    res.status(code).json(result);
  });

  app.delete("/admin/users/:email", (req, res) => {
    if (!allow(req, res, "manage_users")) return;
    const result = deleteUser(req.params.email);
    const code = result.status === "missing" ? 404 : result.status === "rejected" ? 400 : 200;
    res.status(code).json(result);
  });

  app.get("/design/tokens", (req, res) => {
    if (!allowAny(req, res, ["tokens_read", "groups_read"])) return;
    const theme = String(req.query.theme ?? "light");
    const group = req.query.group ? String(req.query.group) : undefined;
    const q = req.query.q ? String(req.query.q) : undefined;
    const catalog = readCatalog();
    res.json({
      theme,
      groups: listGroups(catalog),
      themes: catalog.themes,
      tokens: listTokens({ group, q, theme }),
    });
  });

  app.get("/design/tokens/guidance", (req, res) => {
    if (!allow(req, res, "tokens_read")) return;
    res.json({ helper: helperText(String(req.query.group ?? "")) });
  });

  app.get("/design/tokens/export", (req, res) => {
    if (!allow(req, res, "tokens_read")) return;
    const catalog = normalizeCatalog(readCatalog());
    const body = `${JSON.stringify(catalog, null, 2)}\n`;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("content-disposition", 'attachment; filename="ids-design-tokens.json"');
    res.send(body);
  });

  app.get("/design/tokens/:name", (req, res) => {
    if (!allow(req, res, "tokens_read")) return;
    const token = getToken(req.params.name);
    if (!token) {
      res.status(404).json({ status: "missing" });
      return;
    }
    res.json({ status: "available", token });
  });

  app.post("/design/tokens/resolve", (req, res) => {
    const permission = req.body?.createMissing ? "tokens_create" : "tokens_read";
    if (!allow(req, res, permission)) return;
    const results = resolveNames({
      names: req.body?.names,
      programme: req.body?.programme,
      theme: req.body?.theme,
      createMissing: Boolean(req.body?.createMissing),
      drafts: req.body?.drafts,
    });
    res.json({ results });
  });

  app.post("/design/tokens", (req, res) => {
    if (!allow(req, res, "tokens_create")) return;
    const result = createToken(req.body ?? {});
    res.status(result.status === "rejected" ? 400 : 200).json(result);
  });

  app.patch("/design/tokens/:name", (req, res) => {
    if (!allow(req, res, "tokens_update")) return;
    const result = updateToken(req.params.name, req.body ?? {});
    const code = result.status === "missing" ? 404 : result.status === "rejected" ? 400 : 200;
    res.status(code).json(result);
  });

  app.delete("/design/tokens/:name", (req, res) => {
    if (!allow(req, res, "tokens_delete")) return;
    const result = deleteToken(req.params.name, { replacement: req.body?.replacement });
    const code = result.status === "missing" ? 404 : result.status === "in-use" ? 409 : 200;
    res.status(code).json(result);
  });

  app.get("/design/groups", (req, res) => {
    if (!allow(req, res, "groups_read")) return;
    res.json({ groups: listGroups(readCatalog()) });
  });

  app.post("/design/groups", (req, res) => {
    if (!allow(req, res, "groups_create")) return;
    const result = createGroup(req.body?.name);
    res.status(result.status === "rejected" ? 400 : 200).json(result);
  });

  app.patch("/design/groups", (req, res) => {
    if (!allow(req, res, "groups_update")) return;
    const result = renameGroup(req.body?.from, req.body?.to);
    const code = result.status === "missing" ? 404 : result.status === "rejected" ? 400 : 200;
    res.status(code).json(result);
  });

  app.delete("/design/groups", (req, res) => {
    if (!allow(req, res, "groups_delete")) return;
    const result = deleteGroup(req.body?.name);
    const code = result.status === "missing" ? 404 : result.status === "in-use" ? 409 : 200;
    res.status(code).json(result);
  });

  app.get("/design/themes", (req, res) => {
    if (!allow(req, res, null)) return;
    res.json({ themes: listThemes() });
  });

  app.post("/design/themes", (req, res) => {
    if (!allow(req, res, null)) return;
    const result = createTheme(req.body ?? {});
    res.status(result.status === "rejected" ? 400 : 200).json(result);
  });

  app.delete("/design/themes/:id", (req, res) => {
    if (!allow(req, res, null)) return;
    const result = deleteTheme(req.params.id);
    const code = result.status === "missing" ? 404 : result.status === "rejected" ? 400 : 200;
    res.status(code).json(result);
  });

  app.get("/design/programmes/validate", (req, res) => {
    if (!allow(req, res, null)) return;
    const reports = validateProgrammeFiles().map((report) => ({
      programme: report.programme,
      file: report.file,
      counts: report.counts,
      findings: report.findings.filter((finding) => finding.status !== "in-sync"),
    }));
    res.json({ reports });
  });

  app.put("/design/programmes/:slug/overrides/:name", (req, res) => {
    if (!allow(req, res, "tokens_update")) return;
    const result = patchProgrammeToken(req.params.slug, req.params.name, req.body?.values ?? {});
    res.status(result.status === "rejected" ? 400 : 200).json(result);
  });

  app.post("/design/tokens/themes/rebuild", (req, res) => {
    if (!allow(req, res, "tokens_update")) return;
    const built = buildIdsTheme({ write: true });
    if (built.status !== "built") {
      res.status(400).json(built);
      return;
    }
    const reports = validateProgrammeFiles().map((report) => ({
      programme: report.programme,
      file: report.file,
      counts: report.counts,
    }));
    res.json({ status: "built", path: built.path, reports });
  });

  return app;
}

const port = Number(process.env.DTM_PORT ?? 8110);
if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  ensureAccess();
  createApp().listen(port, () => {
    process.stdout.write(`DTM API http://127.0.0.1:${port}\n`);
  });
}
