/**
 * Local unit checks for component-dependencies (no GitHub).
 * Run: npx tsx lib/component-dependencies.test.ts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildDependencyReport,
  extractDeclaredDependencies,
  extractDeclaredDependenciesFromSpecs,
  parseComponentDependenciesTable,
  parseDependencyIdCell,
} from "./component-dependencies.js";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const here = dirname(fileURLToPath(import.meta.url));
const buttonSpec = readFileSync(
  join(here, "../../components/ids/button/design-spec.md"),
  "utf8",
);

// Id cell parsing
{
  const a = parseDependencyIdCell("asset", "`iconSlug` → `/asset/icons/<iconSlug>.svg`");
  assert(a.id === "iconSlug", `expected iconSlug, got ${a.id}`);
  assert(
    a.assetPathTemplate?.includes("iconSlug"),
    `expected path template, got ${a.assetPathTemplate}`,
  );

  const c = parseDependencyIdCell("component", "`icon` (`IdsIcon`)");
  assert(c.id === "icon", `expected icon slug, got ${c.id}`);
  assert(c.publicName === "IdsIcon", `expected IdsIcon, got ${c.publicName}`);
}

// Button table present → asset only, not IdsIcon
{
  const table = parseComponentDependenciesTable(buttonSpec);
  assert(table !== null, "button should have Component dependencies table");
  assert(table!.length === 1, `expected 1 row, got ${table!.length}`);
  assert(table![0].kind === "asset", "button dep must be asset");
  assert(table![0].id === "iconSlug", "button asset id iconSlug");
}

{
  const { declarationSource, declared } = extractDeclaredDependencies(buttonSpec);
  assert(declarationSource === "table", `expected table, got ${declarationSource}`);
  assert(declared.every((d) => d.kind === "asset"), "no invented component peers");
}

// Resolve with fake fs: no ask_user for asset
{
  const report = await buildDependencyReport(buttonSpec, {
    programme: "ids",
    framework: "react",
    designSpecExists: async () => false,
    libExists: async () => false,
  });
  assert(report.dependencyAction === "clear", "assets must not ask_user");
  assert(report.resolved[0]?.resolution === "asset_only", "expected asset_only");
}

// Named required peer missing → ask_user
{
  const md = `
### Component dependencies (codegen)

| Kind | Id | Required | Notes |
|------|-----|----------|-------|
| component | \`icon\` (\`IdsIcon\`) | required | peer |
`;
  const report = await buildDependencyReport(md, {
    programme: "ids",
    framework: "react",
    designSpecExists: async () => false,
    libExists: async () => false,
  });
  assert(report.dependencyAction === "ask_user", "required missing peer");
  assert(report.askUser[0]?.id === "icon", "ask icon");
}

// Named peer present in lib → use_existing
{
  const md = `
### Component dependencies (codegen)

| Kind | Id | Required | Notes |
|------|-----|----------|-------|
| component | \`icon\` (\`IdsIcon\`) | required | peer |
`;
  const report = await buildDependencyReport(md, {
    programme: "ids",
    framework: "react",
    designSpecExists: async () => true,
    libExists: async () => true,
  });
  assert(report.dependencyAction === "clear", "existing peer clear");
  assert(report.resolved[0]?.resolution === "use_existing", "use_existing");
}

// Free prose without table must not invent Icon component
{
  const prose = `
## Codegen Contract
- render iconSlug via Icon component with variant mask
### Asset resolution + bundling contract
- Icon input uses slug: \`iconSlug\`.
- Resolve icon from \`/asset/icons/<iconSlug>.svg\`.
`;
  const { declared } = extractDeclaredDependencies(prose);
  assert(
    declared.every((d) => d.kind === "asset"),
    "prose must not create component deps",
  );
  assert(!declared.some((d) => d.id === "icon" && d.kind === "component"), "no icon peer");
}

// Multi-spec merge: programme empty table + baseline asset table
{
  const baseline = `
### Component dependencies (codegen)

| Kind | Id | Required | Notes |
|------|-----|----------|-------|
| asset | \`iconSlug\` → \`/asset/icons/<iconSlug>.svg\` | optional | baseline |
`;
  const programme = `
### Component dependencies (codegen)

_No assets or peer components declared in this spec._

| Kind | Id | Required | Notes |
|------|-----|----------|-------|
`;
  const { declarationSource, declared } = extractDeclaredDependenciesFromSpecs([
    programme,
    baseline,
  ]);
  assert(declarationSource === "table", "merged tables");
  assert(declared.some((d) => d.id === "iconSlug"), "baseline asset kept");
}

console.log("component-dependencies.test.ts: OK");
