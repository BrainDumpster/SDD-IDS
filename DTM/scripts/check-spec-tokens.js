import fs from "node:fs";
import { classifyResults, extractTokenNames, offlineMessage, programmeSummary } from "../features/availability/spec-check.js";

const apiUrl = (process.env.DTM_URL ?? "http://127.0.0.1:8110").replace(/\/$/, "");
const uiUrl = (process.env.DTM_UI_URL ?? "http://127.0.0.1:8111").replace(/\/$/, "");

async function getJson(path, body) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(2000),
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${path}`);
  }
  return response.json();
}

function printReport(buckets, reports) {
  console.log("DTM: running");
  console.log(
    `Spec tokens: available ${buckets.available.length}, missing ${buckets.missing.length}, programme-local ${buckets.programmeLocal.length}`,
  );
  if (buckets.missing.length) console.log(`Missing: ${buckets.missing.join(" ")}`);
  if (buckets.programmeLocal.length) console.log(`Programme-local: ${buckets.programmeLocal.join(" ")}`);
  console.log("Programme theme CSS:");
  for (const row of reports) {
    const counts = row.counts ?? {};
    console.log(
      `  ${row.programme} ${row.file}  in-sync ${counts["in-sync"] ?? 0}  override ${counts.override ?? 0}  programme-local ${counts["programme-local"] ?? 0}  missing ${counts.missing ?? 0}`,
    );
  }
  console.log("Catalog was not modified. components/ids-theme.css was not rewritten.");
  console.log("Override = programme value differs and stays in that file.");
  console.log("Missing = catalog name is not in that programme file.");
  console.log("Rebuild components/ids-theme.css from the catalog only after a catalog change.");
}

async function main() {
  const files = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
  if (!files.length) {
    console.error("Usage: node DTM/scripts/check-spec-tokens.js <design-spec.md> [more specs]");
    process.exit(1);
  }
  const missingFiles = files.filter((file) => !fs.existsSync(file));
  if (missingFiles.length) {
    console.error(`Spec file not found: ${missingFiles.join(", ")}`);
    process.exit(1);
  }

  try {
    await getJson("/health");
  } catch {
    console.log(offlineMessage(apiUrl, uiUrl));
    process.exit(0);
  }

  const names = extractTokenNames(files.map((file) => fs.readFileSync(file, "utf8")).join("\n"));
  const resolved = names.length
    ? await getJson("/design/tokens/resolve", { names, createMissing: false })
    : { results: [] };
  const programmes = await getJson("/design/programmes/validate");
  printReport(classifyResults(resolved.results), programmeSummary(programmes.reports));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
