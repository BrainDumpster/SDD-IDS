const NAME_RE = /--[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*/g;

export function extractTokenNames(text) {
  return [...new Set(String(text ?? "").match(NAME_RE) ?? [])].sort();
}

export function classifyResults(results) {
  const buckets = { available: [], missing: [], programmeLocal: [] };
  for (const item of results ?? []) {
    if (item.status === "available") buckets.available.push(item.name);
    else if (item.status === "programme_local") buckets.programmeLocal.push(item.name);
    else if (item.status === "missing") buckets.missing.push(item.name);
  }
  return buckets;
}

export function programmeSummary(reports) {
  return (reports ?? []).map((report) => ({
    programme: report.programme,
    file: report.file,
    counts: report.counts,
  }));
}

export function offlineMessage(apiUrl = "http://127.0.0.1:8110", uiUrl = "http://127.0.0.1:8111") {
  return [
    `DTM API is not running at ${apiUrl}.`,
    "The spec is complete. Token files were not changed.",
    "Start the API (cd DTM && npm start), then either re-run this check or open the DTM UI",
    `(${uiUrl}) and use Programme check.`,
    "Programme check compares each programme theme CSS file with the catalog:",
    "in sync, override, programme-local, and missing.",
    "A programme value that differs is an override. It is not copied into the catalog.",
    "A missing name stays out of that programme file.",
    "After a catalog change, rebuild components/ids-theme.css from the catalog",
    "(DTM UI Rebuild CSS, or POST /design/tokens/themes/rebuild).",
  ].join("\n");
}
