import express from "express";
import { availability, resolveNames } from "../features/availability/availability.js";
import { buildIdsTheme, patchProgrammeToken, validateProgrammeFiles } from "../features/css-export/css-export.js";
import { listGroups } from "../features/groups/groups.js";
import { createTheme, deleteTheme, listThemes } from "../features/themes/themes.js";
import { createToken, deleteToken, getToken, listTokens, updateToken } from "../features/tokens/tokens.js";
import { readCatalog } from "../features/tokens/store.js";
import { helperText } from "../features/validation/validate.js";

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/design/tokens", (req, res) => {
    const theme = String(req.query.theme ?? "light");
    const group = req.query.group ? String(req.query.group) : undefined;
    const q = req.query.q ? String(req.query.q) : undefined;
    const catalog = readCatalog();
    res.json({
      theme,
      groups: listGroups(catalog.tokens),
      themes: catalog.themes,
      tokens: listTokens({ group, q, theme }),
    });
  });

  app.get("/design/tokens/guidance", (req, res) => {
    res.json({ helper: helperText(String(req.query.group ?? "")) });
  });

  app.get("/design/tokens/:name", (req, res) => {
    const token = getToken(req.params.name);
    if (!token) {
      res.status(404).json({ status: "missing" });
      return;
    }
    res.json({ status: "available", token });
  });

  app.post("/design/tokens/resolve", (req, res) => {
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
    const result = createToken(req.body ?? {});
    res.status(result.status === "rejected" ? 400 : 200).json(result);
  });

  app.patch("/design/tokens/:name", (req, res) => {
    const result = updateToken(req.params.name, req.body ?? {});
    const code = result.status === "missing" ? 404 : result.status === "rejected" ? 400 : 200;
    res.status(code).json(result);
  });

  app.delete("/design/tokens/:name", (req, res) => {
    const result = deleteToken(req.params.name);
    const code = result.status === "missing" ? 404 : result.status === "in-use" ? 409 : 200;
    res.status(code).json(result);
  });

  app.get("/design/themes", (_req, res) => {
    res.json({ themes: listThemes() });
  });

  app.post("/design/themes", (req, res) => {
    const result = createTheme(req.body ?? {});
    res.status(result.status === "rejected" ? 400 : 200).json(result);
  });

  app.delete("/design/themes/:id", (req, res) => {
    const result = deleteTheme(req.params.id);
    const code = result.status === "missing" ? 404 : result.status === "rejected" ? 400 : 200;
    res.status(code).json(result);
  });

  app.get("/design/programmes/validate", (_req, res) => {
    const reports = validateProgrammeFiles().map((report) => ({
      programme: report.programme,
      file: report.file,
      counts: report.counts,
      findings: report.findings.filter((finding) => finding.status !== "in-sync"),
    }));
    res.json({ reports });
  });

  app.put("/design/programmes/:slug/overrides/:name", (req, res) => {
    const result = patchProgrammeToken(req.params.slug, req.params.name, req.body?.values ?? {});
    res.status(result.status === "rejected" ? 400 : 200).json(result);
  });

  app.post("/design/tokens/themes/rebuild", (_req, res) => {
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
  createApp().listen(port, () => {
    process.stdout.write(`DTM API http://127.0.0.1:${port}\n`);
  });
}
