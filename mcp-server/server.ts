import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";
import { Agent as UndiciAgent, fetch as undiciFetch } from "undici";
import express, { type Request, type Response } from "express";
import { z } from "zod";
import { buildDeveloperUsageCandidatePaths, type Framework } from "./lib/developer-usage.js";
import { formatDidYouMean, suggestClosestSlugs } from "./lib/fuzzy.js";
import {
  DESIGN_PRINCIPLES_SECTIONS,
  extractExactTitles,
  extractMarkdownSections,
  filterThemeCssByCategory,
  FOUNDATION_CATEGORY_SECTIONS,
  listSectionTitles,
} from "./lib/markdown.js";
import {
  extractCssVarNames,
  filterThemeCssForTokens,
  findUnresolvedComponentAliases,
} from "./lib/theme-filter.js";
import {
  buildDependencyReport,
  formatDependencyReportMarkdown,
  type DependencyReport,
} from "./lib/component-dependencies.js";

const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const HOST = "0.0.0.0";

const DESIGN_SPEC_FILENAME = "design-spec.md";
const ROOT_SPEC_FILENAME = "root-spec.md";
const IDS_BASELINE_ROOT_SPEC_PATH = "components/ids/root-spec.md";
const IDS_BASELINE_THEME_CSS_PATH = "components/ids-theme.css";
const IDS_BASELINE_COMPONENTS_DIR = "components/ids";
const INHERITANCE_REGISTRY_PATH = "data/programme-inheritance-registry.json";
const DEFAULT_PROGRAMME = "ids";

const KNOWN_DOCUMENTATION_CATEGORIES = [
  "design-spec",
  "lib-generation",
  "composition-api",
  "states",
  "tokens",
  "foundations",
  "principles",
  "usage-examples",
  "storybook-parity",
] as const;

interface GitHubConfig {
  host: string;
  apiBaseUrl: string;
  owner: string;
  repo: string;
  repoSlug: string;
  ref?: string;
}

let cachedGitHubConfig: GitHubConfig | null = null;

function resolveGitHubApiBaseUrl(host: string): string {
  const trimmed = host.trim().replace(/\/+$/, "");
  const withoutScheme = trimmed.replace(/^https?:\/\//i, "").toLowerCase();

  // github.com SaaS uses https://api.github.com — not https://github.com/api/v3
  if (
    withoutScheme === "github.com" ||
    withoutScheme === "www.github.com" ||
    withoutScheme === "api.github.com"
  ) {
    return "https://api.github.com";
  }

  if (trimmed.endsWith("/api/v3")) {
    return trimmed;
  }
  // GitHub Enterprise Server
  return `${trimmed}/api/v3`;
}

function parseGitHubRepo(repo: string): { owner: string; name: string } {
  const parts = repo.trim().split("/").filter(Boolean);
  if (parts.length !== 2) {
    throw new Error("GITHUB_REPO must be in owner/repo format (for example data-manager/SDD-IDS)");
  }
  return { owner: parts[0], name: parts[1] };
}

function resolveGitHubRef(): string | undefined {
  const raw = process.env.GITHUB_REF;
  if (raw === undefined) {
    return "main";
  }
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function loadGitHubConfig(): GitHubConfig {
  const host = process.env.GITHUB_HOST?.trim();
  const repoSlug = process.env.GITHUB_REPO?.trim();

  if (!host) {
    throw new Error("GITHUB_HOST environment variable is required (for example https://eos2git.cec.lab.emc.com)");
  }
  if (!repoSlug) {
    throw new Error("GITHUB_REPO environment variable is required (for example org/SDD-IDS)");
  }

  const { owner, name } = parseGitHubRepo(repoSlug);

  return {
    host: host.replace(/\/+$/, ""),
    apiBaseUrl: resolveGitHubApiBaseUrl(host),
    owner,
    repo: name,
    repoSlug,
    ref: resolveGitHubRef(),
  };
}

function getGitHubConfig(): GitHubConfig {
  if (!cachedGitHubConfig) {
    cachedGitHubConfig = loadGitHubConfig();
  }
  return cachedGitHubConfig;
}

function requireGitHubToken(): string {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "GITHUB_PERSONAL_ACCESS_TOKEN (or GITHUB_TOKEN) environment variable is required",
    );
  }
  return token;
}

function shouldVerifyGitHubTls(): boolean {
  const raw = process.env.GITHUB_TLS_VERIFY?.trim().toLowerCase();
  if (raw === "true") {
    return true;
  }
  if (raw === "false") {
    return false;
  }

  // Default: verify for github.com SaaS; skip for corporate GHES (internal CA).
  // Matches ingestion/github_loader.py (verify=False for GHES).
  const host = process.env.GITHUB_HOST?.trim().toLowerCase() ?? "";
  return host === "https://github.com" || host === "github.com";
}

let insecureUndiciDispatcher: UndiciAgent | undefined;

function getInsecureGitHubFetch(): typeof fetch {
  if (!insecureUndiciDispatcher) {
    insecureUndiciDispatcher = new UndiciAgent({
      connect: { rejectUnauthorized: false },
    });
  }

  const dispatcher = insecureUndiciDispatcher;
  const insecureFetch = (url: RequestInfo | URL, init?: RequestInit) =>
    undiciFetch(url as string | URL, {
      ...(init as Parameters<typeof undiciFetch>[1]),
      dispatcher,
    });

  return insecureFetch as unknown as typeof fetch;
}

function createOctokit(): Octokit {
  const config = getGitHubConfig();
  const tlsVerify = shouldVerifyGitHubTls();

  return new Octokit({
    auth: requireGitHubToken(),
    baseUrl: config.apiBaseUrl,
    ...(tlsVerify
      ? {}
      : {
          request: {
            fetch: getInsecureGitHubFetch(),
          },
        }),
  });
}

function buildGitHubContentsApiUrl(path: string): string {
  const config = getGitHubConfig();
  const encodedPath = path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const refQuery = config.ref ? `?ref=${encodeURIComponent(config.ref)}` : "";
  return `${config.apiBaseUrl}/repos/${config.repoSlug}/contents/${encodedPath}${refQuery}`;
}

interface GitHubErrorContext {
  operation: string;
  path: string;
}

function formatGitHubApiError(error: unknown, context: GitHubErrorContext): string {
  const config = getGitHubConfig();

  if (error instanceof RequestError) {
    const lines = [
      `${context.operation} failed: HTTP ${error.status}`,
      `Request: GET ${buildGitHubContentsApiUrl(context.path)}`,
      `Repository: ${config.repoSlug}`,
      `Ref: ${config.ref ?? "(repository default branch)"}`,
    ];

    if (error.message) {
      lines.push(`Message: ${error.message}`);
    }

    const hints: string[] = [];

    if (error.status === 401 || error.status === 403) {
      hints.push(
        "Check GITHUB_PERSONAL_ACCESS_TOKEN — expired token, wrong scope, or no read access to this repository.",
      );
    }

    if (error.status === 404) {
      hints.push(`Path \`${context.path}\` does not exist on the configured ref.`);
      hints.push(
        "This MCP server expects: components/<programme>/<component>/design-spec.md (for example components/ids/button/design-spec.md).",
      );
      hints.push(
        "Point GITHUB_REPO at the repository that hosts the components/ tree (for example your SDD-IDS or Component-Specs repo), not ids-content unless components/ exists there.",
      );
    }

    if (error.status === 500) {
      hints.push(
        "GHES returned 500 — common causes: invalid/expired PAT, missing ref/branch, path does not exist, or a GHES server-side error.",
      );
      hints.push(`Verify ref \`${config.ref ?? "main"}\` exists and contains \`${context.path}\`.`);
      hints.push(
        `Test manually: curl -sk -H "Authorization: token $GITHUB_PERSONAL_ACCESS_TOKEN" "${buildGitHubContentsApiUrl(context.path)}"`,
      );
    }

    const extraCaCerts = process.env.NODE_EXTRA_CA_CERTS?.trim();
    if (extraCaCerts) {
      hints.push(
        `NODE_EXTRA_CA_CERTS is set to "${extraCaCerts}". If Node logs "load failed: No such file", fix the path (common typo: /user/local → /usr/local) or unset it.`,
      );
    }

    if (hints.length > 0) {
      lines.push("", "Hints:");
      for (const hint of hints) {
        lines.push(`- ${hint}`);
      }
    }

    return lines.join("\n");
  }

  return error instanceof Error ? error.message : String(error);
}

function sanitizeNodeExtraCaCerts(): void {
  const raw = process.env.NODE_EXTRA_CA_CERTS?.trim();
  if (!raw) {
    return;
  }

  if (existsSync(raw)) {
    return;
  }

  console.warn(
    `WARNING: NODE_EXTRA_CA_CERTS="${raw}" points to a missing file. ` +
      "Unset it or fix the path (common typo: /user/local → /usr/local). " +
      "Clearing NODE_EXTRA_CA_CERTS for this process.",
  );
  delete process.env.NODE_EXTRA_CA_CERTS;
}

async function probeGitHubConnectivity(): Promise<{ ok: boolean; message: string }> {
  const config = getGitHubConfig();
  const probePath = IDS_BASELINE_COMPONENTS_DIR;

  try {
    const octokit = createOctokit();
    await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: probePath,
      ...contentsRequestParams(config),
    });
    return {
      ok: true,
      message: `GitHub OK: ${config.repoSlug}@${config.ref ?? "default"} contains ${probePath}`,
    };
  } catch (error) {
    return {
      ok: false,
      message: formatGitHubApiError(error, {
        operation: "Startup GitHub connectivity probe",
        path: probePath,
      }),
    };
  }
}

function contentsRequestParams(config: GitHubConfig): { ref?: string } {
  return config.ref ? { ref: config.ref } : {};
}

const frameworkSchema = z
  .enum(["react", "angular"])
  .default("react")
  .describe("Target framework for Storybook parity / Docs lookup (default: react)");

const programmeSchema = z
  .string()
  .min(1, "programme is required")
  .regex(/^[a-zA-Z0-9._-]+$/, "programme contains invalid characters")
  .default(DEFAULT_PROGRAMME)
  .describe(`Business programme folder under components/ (default: ${DEFAULT_PROGRAMME})`);

const componentNameSchema = z
  .string()
  .min(1, "componentName is required")
  .regex(/^[a-zA-Z0-9._-]+$/, "componentName contains invalid characters");

const foundationCategorySchema = z
  .enum([
    "color",
    "spacing",
    "typography",
    "elevation",
    "radius",
    "border",
    "opacity",
    "breakpoints",
    "all",
  ])
  .default("all")
  .describe("Foundation category to return from root-spec / theme CSS (default: all)");

const REACT_STORYBOOK_EXTENSIONS = [".stories.tsx", ".stories.ts", ".stories.jsx", ".stories.js"] as const;
const ANGULAR_STORYBOOK_EXTENSIONS = [".stories.ts"] as const;

function mcpTextResult(text: string, isError = false) {
  return {
    content: [{ type: "text" as const, text }],
    ...(isError ? { isError: true } : {}),
  };
}

function buildMetaMarkdown(meta: Record<string, unknown>, body: string): string {
  return ["```json", JSON.stringify(meta, null, 2), "```", "", body].join("\n");
}

function normalizeSectionList(sections: string | string[]): string[] {
  const list = Array.isArray(sections) ? sections : [sections];
  return list.map((section) => section.trim()).filter(Boolean);
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: number }).status === 404
  );
}

async function fetchRawFile(octokit: Octokit, path: string): Promise<string> {
  const config = getGitHubConfig();
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: config.owner,
    repo: config.repo,
    path,
    ...contentsRequestParams(config),
    headers: {
      accept: "application/vnd.github.v3.raw",
    },
  });

  if (typeof data !== "string") {
    throw new Error(`Unexpected response type for ${path}`);
  }

  return data;
}

type FetchedFile = { path: string; content: string };

interface InheritanceRegistryComponent {
  programme: string;
  slug: string;
  idsBaselineSlug?: string;
  idsBaselineSpecPath?: string;
}

interface InheritanceRegistry {
  components?: InheritanceRegistryComponent[];
}

let cachedInheritanceRegistry: InheritanceRegistry | null | undefined;

function isIdsProgramme(programme: string): boolean {
  return programme.toLowerCase() === "ids";
}

function programmeRequiresIdsBaseline(programme: string): boolean {
  return !isIdsProgramme(programme);
}

function normalizeProgrammeSlug(programme: string): string {
  return programme.toLowerCase();
}

function resolveProgrammeRootSpecPath(programme: string): string {
  return `components/${programme}/${ROOT_SPEC_FILENAME}`;
}

function resolveProgrammeThemeCssPath(programme: string): string {
  return `components/${programme.toLowerCase()}-theme.css`;
}

function resolveIdsBaselineDesignSpecPath(idsBaselineSlug: string): string {
  return `${IDS_BASELINE_COMPONENTS_DIR}/${idsBaselineSlug}/${DESIGN_SPEC_FILENAME}`;
}

async function loadInheritanceRegistry(octokit: Octokit): Promise<InheritanceRegistry | null> {
  if (cachedInheritanceRegistry !== undefined) {
    return cachedInheritanceRegistry;
  }

  try {
    const content = await fetchRawFile(octokit, INHERITANCE_REGISTRY_PATH);
    cachedInheritanceRegistry = JSON.parse(content) as InheritanceRegistry;
    return cachedInheritanceRegistry;
  } catch {
    cachedInheritanceRegistry = null;
    return null;
  }
}

function findInheritanceRegistryEntry(
  registry: InheritanceRegistry | null,
  programme: string,
  componentName: string,
): InheritanceRegistryComponent | null {
  if (!registry?.components?.length) {
    return null;
  }

  const programmeKey = normalizeProgrammeSlug(programme);
  return (
    registry.components.find(
      (entry) =>
        normalizeProgrammeSlug(entry.programme) === programmeKey && entry.slug === componentName,
    ) ?? null
  );
}

function buildIdsBaselineDesignSpecCandidates(
  componentName: string,
  registryEntry: InheritanceRegistryComponent | null,
): string[] {
  const candidates = new Set<string>();

  if (registryEntry?.idsBaselineSpecPath) {
    candidates.add(registryEntry.idsBaselineSpecPath);
  }

  const baselineSlug = registryEntry?.idsBaselineSlug ?? componentName;
  candidates.add(resolveIdsBaselineDesignSpecPath(baselineSlug));
  candidates.add(resolveIdsBaselineDesignSpecPath(componentName));

  return [...candidates];
}

async function fetchFirstAvailableFile(
  octokit: Octokit,
  candidatePaths: string[],
): Promise<FetchedFile | null> {
  for (const path of candidatePaths) {
    const file = await fetchOptionalRawFile(octokit, path);
    if (file) {
      return file;
    }
  }
  return null;
}

async function resolveIdsBaselineDesignSpec(
  octokit: Octokit,
  programme: string,
  componentName: string,
): Promise<FetchedFile | null> {
  const registry = await loadInheritanceRegistry(octokit);
  const registryEntry = findInheritanceRegistryEntry(registry, programme, componentName);
  const candidates = buildIdsBaselineDesignSpecCandidates(componentName, registryEntry);
  return fetchFirstAvailableFile(octokit, candidates);
}

async function fetchOptionalRawFile(octokit: Octokit, path: string): Promise<FetchedFile | null> {
  try {
    const content = await fetchRawFile(octokit, path);
    return { path, content };
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

/** True if path exists as file or directory in the configured GitHub repo@ref. */
async function githubPathExists(octokit: Octokit, path: string): Promise<boolean> {
  const config = getGitHubConfig();
  try {
    await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path,
      ...contentsRequestParams(config),
    });
    return true;
  } catch (error) {
    if (isNotFoundError(error)) {
      return false;
    }
    throw error;
  }
}

async function resolveSpecDependencies(
  octokit: Octokit,
  markdowns: string | string[],
  programme: string,
  framework: Framework,
): Promise<DependencyReport> {
  return buildDependencyReport(markdowns, {
    programme,
    framework,
    designSpecExists: (path) => githubPathExists(octokit, path),
    libExists: (path) => githubPathExists(octokit, path),
  });
}

function appendDeliverableSection(
  sections: string[],
  title: string,
  file: FetchedFile | null,
  notFoundMessage: string,
  language?: "css",
): void {
  sections.push("", `## ${title}`);
  if (file) {
    sections.push(`Source: \`${file.path}\``, "");
    if (language) {
      sections.push(`\`\`\`${language}`, file.content, "```");
    } else {
      sections.push(file.content);
    }
    return;
  }
  sections.push(notFoundMessage);
}

async function listDirectoryEntries(octokit: Octokit, path: string): Promise<string[]> {
  const config = getGitHubConfig();
  const { data } = await octokit.repos.getContent({
    owner: config.owner,
    repo: config.repo,
    path,
    ...contentsRequestParams(config),
  });

  if (!Array.isArray(data)) {
    throw new Error(`Expected directory at ${path}`);
  }

  return data
    .filter((entry) => entry.type === "dir")
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function toPascalCase(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function getStorybookPrefixes(programme: string, componentName: string): string[] {
  const pascal = toPascalCase(componentName);
  const programmeLower = programme.toLowerCase();

  if (programmeLower === "ids") {
    return [`Ids${pascal}`, pascal];
  }
  if (programmeLower === "synapse") {
    return [`Synapse${pascal}`, pascal];
  }
  if (programmeLower === "dap") {
    return [`Ids${pascal}Dap`, `Ids${pascal}`, pascal];
  }

  return [pascal, `${programme}${pascal}`];
}

function getAngularComponentFolderPrefix(programme: string): string {
  const programmeLower = programme.toLowerCase();
  if (programmeLower === "dap") {
    return "ids";
  }
  return programmeLower;
}

function buildReactStorybookCandidatePaths(programme: string, componentName: string): string[] {
  const pascal = toPascalCase(componentName);
  const programmeLower = programme.toLowerCase();
  const candidates = new Set<string>();

  for (const extension of REACT_STORYBOOK_EXTENSIONS) {
    candidates.add(`components/${programme}/${componentName}/${componentName}${extension}`);
    candidates.add(`components/${programme}/${componentName}/index${extension}`);
  }

  for (const prefix of getStorybookPrefixes(programme, componentName)) {
    for (const extension of REACT_STORYBOOK_EXTENSIONS) {
      candidates.add(`storybook/src/components/${prefix}${extension}`);
      if (programmeLower === "dap") {
        candidates.add(`storybook/src/components/dap/${prefix}${extension}`);
      }
    }
  }

  for (const extension of REACT_STORYBOOK_EXTENSIONS) {
    candidates.add(`storybook-generated/${programmeLower}/src/components/${pascal}${extension}`);
  }

  return [...candidates];
}

function buildAngularStorybookCandidatePaths(programme: string, componentName: string): string[] {
  const folderPrefix = getAngularComponentFolderPrefix(programme);
  const componentFolder = `${folderPrefix}-${componentName}`;
  const candidates = new Set<string>();

  for (const extension of ANGULAR_STORYBOOK_EXTENSIONS) {
    candidates.add(`components/${programme}/${componentName}/${componentName}${extension}`);
    candidates.add(`components/${programme}/${componentName}/index${extension}`);
    candidates.add(`storybook-angular/src/components/${componentFolder}/${componentFolder}${extension}`);
    candidates.add(`storybook-angular/src/components/${componentFolder}/${componentName}${extension}`);
  }

  return [...candidates];
}

function buildStorybookCandidatePaths(
  programme: string,
  componentName: string,
  framework: Framework,
): string[] {
  return framework === "angular"
    ? buildAngularStorybookCandidatePaths(programme, componentName)
    : buildReactStorybookCandidatePaths(programme, componentName);
}

function getStorybookExtensions(framework: Framework): readonly string[] {
  return framework === "angular" ? ANGULAR_STORYBOOK_EXTENSIONS : REACT_STORYBOOK_EXTENSIONS;
}

async function fetchCompanionStorybookFile(
  octokit: Octokit,
  programme: string,
  componentName: string,
  framework: Framework,
): Promise<{ path: string; content: string } | null> {
  const componentDirectoryPath = `components/${programme}/${componentName}`;
  const storyExtensions = getStorybookExtensions(framework);
  const config = getGitHubConfig();

  try {
    const { data } = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: componentDirectoryPath,
      ...contentsRequestParams(config),
    });

    if (Array.isArray(data)) {
      const storyEntry = data.find(
        (entry) =>
          entry.type === "file" && storyExtensions.some((extension) => entry.name.endsWith(extension)),
      );

      if (storyEntry) {
        const content = await fetchRawFile(octokit, `${componentDirectoryPath}/${storyEntry.name}`);
        return { path: `${componentDirectoryPath}/${storyEntry.name}`, content };
      }
    }
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }

  for (const candidatePath of buildStorybookCandidatePaths(programme, componentName, framework)) {
    try {
      const content = await fetchRawFile(octokit, candidatePath);
      return { path: candidatePath, content };
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }
    }
  }

  return null;
}

async function fetchDeveloperUsageFile(
  octokit: Octokit,
  programme: string,
  componentName: string,
  framework: Framework,
): Promise<FetchedFile | null> {
  const candidates = buildDeveloperUsageCandidatePaths(programme, componentName, framework);
  return fetchFirstAvailableFile(octokit, candidates);
}

async function fetchProgrammeDesignSpec(
  octokit: Octokit,
  programme: string,
  componentName: string,
): Promise<{ path: string; content: string }> {
  const path = `components/${programme}/${componentName}/${DESIGN_SPEC_FILENAME}`;
  const content = await fetchRawFile(octokit, path);
  return { path, content };
}

function formatExtractedSections(params: {
  meta: Record<string, unknown>;
  found: { title: string; body: string }[];
  missing: string[];
  available?: string[];
  extraBlocks?: string[];
}): string {
  const parts: string[] = [];

  if (params.found.length === 0 && params.missing.length > 0) {
    parts.push(
      `_Requested sections not found: ${params.missing.map((s) => `\`${s}\``).join(", ")}_`,
    );
    if (params.available?.length) {
      parts.push("", "**Available sections:**", ...params.available.map((s) => `- ${s}`));
    }
    return buildMetaMarkdown(
      {
        ...params.meta,
        sectionsReturned: [],
        missing: params.missing,
        available: params.available ?? [],
      },
      parts.join("\n"),
    );
  }

  for (const section of params.found) {
    parts.push(section.body, "");
  }

  if (params.missing.length > 0) {
    parts.push(
      `_Missing requested sections: ${params.missing.map((s) => `\`${s}\``).join(", ")}_`,
      "",
    );
  }

  if (params.extraBlocks?.length) {
    for (const block of params.extraBlocks) {
      parts.push(block, "");
    }
  }

  return buildMetaMarkdown(
    {
      ...params.meta,
      sectionsReturned: params.found.map((s) => s.title),
      missing: params.missing,
    },
    parts.join("\n").trimEnd(),
  );
}

async function listProgrammeDirectories(octokit: Octokit): Promise<string[]> {
  return listDirectoryEntries(octokit, "components");
}

async function suggestComponentSlugs(
  octokit: Octokit,
  programme: string,
  componentName: string,
): Promise<string[]> {
  try {
    const slugs = await listDirectoryEntries(octokit, `components/${programme}`);
    return suggestClosestSlugs(componentName, slugs, 5);
  } catch {
    return [];
  }
}

async function notFoundDesignSpecMessage(
  octokit: Octokit,
  programme: string,
  componentName: string,
  path: string,
): Promise<string> {
  const suggestions = await suggestComponentSlugs(octokit, programme, componentName);
  return (
    `404 Not Found: design specification \`${path}\` does not exist.` +
    formatDidYouMean(suggestions)
  );
}

const AGENT_GENERATION_CONTRACT_PATH = "data/agent-generation-contract.md";

function resolveComponentContractPaths(programme: string, componentName: string): string[] {
  const programmeLower = programme.toLowerCase();
  const paths = [
    `component-contracts/${programmeLower}/${componentName}.contract.ts`,
    `component-contracts/${programmeLower}/${componentName}.contract.js`,
  ];
  if (programmeLower !== "ids") {
    paths.push(
      `component-contracts/ids/${componentName}.contract.ts`,
      `component-contracts/ids/${componentName}.contract.js`,
    );
  }
  return paths;
}

function buildLibOutputInstructions(programme: string, componentName: string, framework: Framework): string {
  const pascal = componentName
    .split(/[-_]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const programmeLower = programme.toLowerCase();

  if (framework === "angular") {
    const folder = `lib/angular/${programmeLower}/${componentName}`;
    const sel = programmeLower === "ids" ? `ids-${componentName}` : `${programmeLower}-${componentName}`;
    return [
      `## Lib output contract (Angular)`,
      `- Output directory: \`${folder}/\``,
      `- Selector / files: \`${sel}.component.ts\`, \`.html\`, \`.scss\`, \`index.ts\``,
      `- Style with CSS variables only (\`var(--...)\`); do not hardcode colors/spacing/radius when a token exists in this pack.`,
      `- Implement full variant/state matrix and fallbacks from Codegen Contract + Validation checklist.`,
      `- Do not invent props, tokens, or measurements not present in this pack.`,
    ].join("\n");
  }

  const folder = `lib/react/${programmeLower}/${componentName}`;
  return [
    `## Lib output contract (React)`,
    `- Output directory: \`${folder}/\``,
    `- Primary files: \`Ids${pascal}.tsx\`, \`Ids${pascal}.module.css\`, \`index.ts\` (match existing lib conventions for this programme)`,
    `- Public component name: \`Ids${pascal}\` (Ids + PascalCase anatomy)`,
    `- Style with CSS variables only (\`var(--...)\`); do not hardcode colors/spacing/radius when a token exists in this pack.`,
    `- Implement full variant/state matrix and fallbacks from Codegen Contract + Validation checklist.`,
    `- Do not invent props, tokens, or measurements not present in this pack.`,
    `- Prefer content/projection patterns documented in Composition & API / Codegen Contract over guessing.`,
  ].join("\n");
}

const FOUNDATION_CATEGORIES = Object.keys(FOUNDATION_CATEGORY_SECTIONS).filter((k) => k !== "all");

const DOCUMENTATION_CATEGORY_TOOLS: Record<string, string[]> = {
  "design-spec": ["get_design_spec", "get_design_spec_section", "get_lib_generation_context", "get_component_context"],
  "composition-api": ["get_composition_api"],
  states: ["get_component_states"],
  tokens: ["get_component_tokens"],
  foundations: ["get_foundation_tokens"],
  principles: ["get_design_principles"],
  "usage-examples": ["get_usage_examples"],
  "storybook-parity": ["get_usage_examples", "get_component_context"],
  "lib-generation": ["get_lib_generation_context", "resolve_component_dependencies"],
};

function buildComponentContextMarkdown(params: {
  programme: string;
  componentName: string;
  framework: Framework;
  includesIdsBaseline: boolean;
  programmeDesignSpecPath: string;
  programmeDesignSpecContent: string;
  idsBaselineDesignSpec: FetchedFile | null;
  idsBaselineRootSpec: FetchedFile | null;
  idsBaselineThemeCss: FetchedFile | null;
  programmeRootSpec: FetchedFile | null;
  programmeThemeCss: FetchedFile | null;
  storybook: FetchedFile | null;
}): string {
  const frameworkLabel = params.framework === "angular" ? "Angular" : "React";
  const sections: string[] = [
    `# Component Context: ${params.programme}/${params.componentName}`,
    "",
    `**Parity framework:** ${frameworkLabel}`,
    "",
  ];

  if (params.includesIdsBaseline) {
    sections.push(
      "_Deliverables: IDS baseline bundle (component design spec, root spec, theme CSS) plus programme bundle and optional Storybook parity._",
      "",
    );

    appendDeliverableSection(
      sections,
      "IDS Baseline Design Specification",
      params.idsBaselineDesignSpec,
      `_No IDS baseline design specification found for programme component \`${params.componentName}\`. Checked inheritance registry and \`${IDS_BASELINE_COMPONENTS_DIR}/<slug>/design-spec.md\`._`,
    );

    appendDeliverableSection(
      sections,
      "IDS Baseline Root Specification",
      params.idsBaselineRootSpec,
      `_No IDS baseline root specification found at \`${IDS_BASELINE_ROOT_SPEC_PATH}\`._`,
    );

    appendDeliverableSection(
      sections,
      "IDS Baseline Theme CSS (Design Tokens)",
      params.idsBaselineThemeCss,
      `_No IDS baseline theme CSS found at \`${IDS_BASELINE_THEME_CSS_PATH}\`._`,
      "css",
    );

    sections.push("", "## Programme Design Specification", `Source: \`${params.programmeDesignSpecPath}\``, "", params.programmeDesignSpecContent);

    appendDeliverableSection(
      sections,
      "Programme Root Specification",
      params.programmeRootSpec,
      `_No programme root specification found at \`${resolveProgrammeRootSpecPath(params.programme)}\`._`,
    );

    appendDeliverableSection(
      sections,
      "Programme Theme CSS (Design Tokens)",
      params.programmeThemeCss,
      `_No programme theme CSS found at \`${resolveProgrammeThemeCssPath(params.programme)}\`._`,
      "css",
    );
  } else {
    sections.push(
      "_Deliverables: component design spec, programme root spec, programme theme CSS (token variables), and optional Storybook parity._",
      "",
      "## Design Specification",
      `Source: \`${params.programmeDesignSpecPath}\``,
      "",
      params.programmeDesignSpecContent,
    );

    appendDeliverableSection(
      sections,
      "Programme Root Specification",
      params.programmeRootSpec,
      `_No programme root specification found at \`${resolveProgrammeRootSpecPath(params.programme)}\`._`,
    );

    appendDeliverableSection(
      sections,
      "Programme Theme CSS (Design Tokens)",
      params.programmeThemeCss,
      `_No programme theme CSS found at \`${resolveProgrammeThemeCssPath(params.programme)}\`._`,
      "css",
    );
  }

  if (params.storybook) {
    sections.push(
      "",
      `## Storybook Companion (${frameworkLabel} parity)`,
      `Source: \`${params.storybook.path}\``,
      "",
      params.storybook.content,
    );
  } else {
    sections.push(
      "",
      `## Storybook Companion (${frameworkLabel} parity)`,
      `_No ${frameworkLabel} Storybook story file was found for this component._`,
    );
  }

  return sections.join("\n");
}

interface McpSession {
  transport: StreamableHTTPServerTransport;
  server: McpServer;
}

const sessions = new Map<string, McpSession>();

function getSessionId(req: Request): string | undefined {
  const header = req.headers["mcp-session-id"];
  if (typeof header === "string") {
    return header;
  }
  if (Array.isArray(header)) {
    return header[0];
  }
  return undefined;
}

function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "sdd-ids-design-spec-mcp-server",
    version: "1.4.0",
  });

  server.registerTool(
    "list_components",
    {
      title: "List Components",
      description:
        "Discovers available UI component slugs under components/<programme>/. Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME }) => {
      const octokit = createOctokit();
      const directoryPath = `components/${programme}`;

      try {
        const components = await listDirectoryEntries(octokit, directoryPath);
        const payload = {
          programme,
          path: directoryPath,
          components,
          count: components.length,
        };

        return mcpTextResult(JSON.stringify(payload, null, 2));
      } catch (error) {
        if (isNotFoundError(error)) {
          return mcpTextResult(
            `404 Not Found: programme directory \`${directoryPath}\` does not exist in ${getGitHubConfig().repoSlug} on GitHub Enterprise.`,
            true,
          );
        }

        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "list_components",
            path: directoryPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_component_context",
    {
      title: "Get Component Context",
      description:
        "Fetches a large deliverable bundle (design-spec + root-spec + full theme CSS + Storybook). For pixel-perfect lib/ codegen prefer get_lib_generation_context (fail-closed, filtered tokens). Use this for broad exploration only. Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
        componentName: componentNameSchema.describe("Component slug folder name under the programme"),
        framework: frameworkSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, componentName, framework = "react" }) => {
      const octokit = createOctokit();
      const programmeDesignSpecPath = `components/${programme}/${componentName}/${DESIGN_SPEC_FILENAME}`;

      try {
        const programmeRootSpecPath = resolveProgrammeRootSpecPath(programme);
        const programmeThemeCssPath = resolveProgrammeThemeCssPath(programme);
        const includesIdsBaseline = programmeRequiresIdsBaseline(programme);

        const [
          programmeDesignSpecContent,
          programmeRootSpec,
          programmeThemeCss,
          storybook,
          idsBaselineDesignSpec,
          idsBaselineRootSpec,
          idsBaselineThemeCss,
        ] = await Promise.all([
          fetchRawFile(octokit, programmeDesignSpecPath),
          fetchOptionalRawFile(octokit, programmeRootSpecPath),
          fetchOptionalRawFile(octokit, programmeThemeCssPath),
          fetchCompanionStorybookFile(octokit, programme, componentName, framework),
          includesIdsBaseline
            ? resolveIdsBaselineDesignSpec(octokit, programme, componentName)
            : Promise.resolve(null),
          includesIdsBaseline
            ? fetchOptionalRawFile(octokit, IDS_BASELINE_ROOT_SPEC_PATH)
            : Promise.resolve(null),
          includesIdsBaseline
            ? fetchOptionalRawFile(octokit, IDS_BASELINE_THEME_CSS_PATH)
            : Promise.resolve(null),
        ]);

        const markdown = buildComponentContextMarkdown({
          programme,
          componentName,
          framework,
          includesIdsBaseline,
          programmeDesignSpecPath,
          programmeDesignSpecContent,
          idsBaselineDesignSpec,
          idsBaselineRootSpec,
          idsBaselineThemeCss,
          programmeRootSpec,
          programmeThemeCss,
          storybook,
        });

        return mcpTextResult(markdown);
    } catch (error) {
      if (isNotFoundError(error)) {
        return mcpTextResult(
          await notFoundDesignSpecMessage(octokit, programme, componentName, programmeDesignSpecPath),
          true,
        );
      }

      return mcpTextResult(
        formatGitHubApiError(error, {
          operation: "get_component_context",
          path: programmeDesignSpecPath,
        }),
        true,
      );
    }
  },
  );

  server.registerTool(
    "discover_design_system",
    {
      title: "Discover Design System",
      description:
        "Catalogues programmes under components/, documentation categories with tool pointers, foundation categories, sample component slugs, and MCP tools. Call first when exploring. Optional programme focuses the sample list (default ids). Content is pinned by server GITHUB_REF (live GitHub fetch — no refresh_cache).",
      inputSchema: {
        programme: programmeSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME }) => {
      const octokit = createOctokit();
      try {
        const programmes = await listProgrammeDirectories(octokit);
        let components: string[] = [];
        let componentPath = `components/${programme}`;
        try {
          components = await listDirectoryEntries(octokit, componentPath);
        } catch (error) {
          if (!isNotFoundError(error)) {
            throw error;
          }
          componentPath = `(missing) ${componentPath}`;
        }

        const sampleLimit = 25;
        const payload = {
          defaultProgramme: DEFAULT_PROGRAMME,
          programmes,
          focusProgramme: programme,
          focusProgrammeComponentCount: components.length || null,
          focusProgrammePath: componentPath,
          sampleComponents: components.slice(0, sampleLimit),
          sampleComponentsTruncated: components.length > sampleLimit,
          documentationCategories: [...KNOWN_DOCUMENTATION_CATEGORIES],
          documentationCategoryTools: DOCUMENTATION_CATEGORY_TOOLS,
          foundationCategories: FOUNDATION_CATEGORIES,
          resources: [
            "sdd://programmes",
            "sdd://documentation/{programme}/components",
            "sdd://documentation/{programme}/components/{slug}",
            "sdd://documentation/{programme}/foundations/{category}",
          ],
          tools: [
            "list_components",
            "get_lib_generation_context",
            "resolve_component_dependencies",
            "get_component_context",
            "discover_design_system",
            "get_design_spec",
            "get_design_spec_section",
            "get_composition_api",
            "get_component_states",
            "get_component_tokens",
            "get_foundation_tokens",
            "get_design_principles",
            "get_usage_examples",
            "search_registry",
          ],
          versionPinning: {
            mechanism: "GITHUB_REF",
            ref: getGitHubConfig().ref ?? "(repository default branch)",
            note: "No per-call semantic version and no refresh_cache — content is live-fetched from GitHub.",
          },
          notes: [
            "This MCP provides design context and documentation only — it does not generate code.",
            "For pixel-perfect lib/ codegen, ALWAYS call get_lib_generation_context and generate ONLY from that pack.",
            "Dependencies: resolve_component_dependencies (or the deps section inside get_lib_generation_context) — spec-declared only; assets ≠ peer components.",
            "Use section tools / get_design_spec for IDE Q&A; not as the sole input for lib generation.",
            "Programme folders are case-sensitive (ids, synapse, DAP).",
          ],
        };

        return mcpTextResult(JSON.stringify(payload, null, 2));
      } catch (error) {
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "discover_design_system",
            path: "components",
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_design_spec",
    {
      title: "Get Design Spec",
      description:
        "Returns the full component design-spec.md (all sections). For non-IDS programmes also includes the IDS baseline design-spec when inheritance applies. Does not include root-spec, theme CSS, or Storybook — use get_component_context for the full bundle, or get_design_spec_section for a single section. Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
        componentName: componentNameSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, componentName }) => {
      const octokit = createOctokit();
      const programmeDesignSpecPath = `components/${programme}/${componentName}/${DESIGN_SPEC_FILENAME}`;

      try {
        const programmeSpec = await fetchProgrammeDesignSpec(octokit, programme, componentName);
        const parts: string[] = [
          `# Design Spec: ${programme}/${componentName}`,
          "",
        ];
        const paths: string[] = [programmeSpec.path];

        if (programmeRequiresIdsBaseline(programme)) {
          const baseline = await resolveIdsBaselineDesignSpec(octokit, programme, componentName);
          if (baseline) {
            paths.push(baseline.path);
            parts.push(
              `## IDS Baseline Design Specification`,
              `Source: \`${baseline.path}\``,
              "",
              baseline.content,
              "",
              `## Programme Design Specification`,
              `Source: \`${programmeSpec.path}\``,
              "",
              programmeSpec.content,
            );
          } else {
            parts.push(
              `_No IDS baseline design specification found for \`${componentName}\`._`,
              "",
              `## Programme Design Specification`,
              `Source: \`${programmeSpec.path}\``,
              "",
              programmeSpec.content,
            );
          }
        } else {
          parts.push(`Source: \`${programmeSpec.path}\``, "", programmeSpec.content);
        }

        return mcpTextResult(
          buildMetaMarkdown(
            { programme, componentName, paths, tool: "get_design_spec" },
            parts.join("\n").trimEnd(),
          ),
        );
      } catch (error) {
        if (isNotFoundError(error)) {
          return mcpTextResult(
            await notFoundDesignSpecMessage(octokit, programme, componentName, programmeDesignSpecPath),
            true,
          );
        }
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "get_design_spec",
            path: programmeDesignSpecPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_lib_generation_context",
    {
      title: "Get Lib Generation Context",
      description:
        "MANDATORY fail-closed pack for pixel-perfect lib/ codegen (React or Angular). Returns design-spec, root-spec, filtered theme CSS (tokens referenced by the spec + alias chain), Composition & API, Codegen Contract, agent-generation-contract, optional component-contracts, resolved spec-declared dependencies (assets vs peers), and lib output path rules. Generate ONLY from this pack — do not invent tokens, sizes, props, or peer components. Fails if design-spec/theme missing or required layout aliases are unresolved. Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
        componentName: componentNameSchema,
        framework: frameworkSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, componentName, framework = "react" }) => {
      const octokit = createOctokit();
      const programmeDesignSpecPath = `components/${programme}/${componentName}/${DESIGN_SPEC_FILENAME}`;
      const programmeRootPath = resolveProgrammeRootSpecPath(programme);
      const programmeThemePath = resolveProgrammeThemeCssPath(programme);
      const paths: string[] = [];
      const blockers: string[] = [];

      try {
        const programmeSpec = await fetchProgrammeDesignSpec(octokit, programme, componentName);
        paths.push(programmeSpec.path);

        let idsBaselineSpec: FetchedFile | null = null;
        if (programmeRequiresIdsBaseline(programme)) {
          idsBaselineSpec = await resolveIdsBaselineDesignSpec(octokit, programme, componentName);
          if (idsBaselineSpec) {
            paths.push(idsBaselineSpec.path);
          }
        }

        const programmeRoot = await fetchOptionalRawFile(octokit, programmeRootPath);
        const idsRoot = programmeRequiresIdsBaseline(programme)
          ? await fetchOptionalRawFile(octokit, IDS_BASELINE_ROOT_SPEC_PATH)
          : isIdsProgramme(programme)
            ? programmeRoot
            : await fetchOptionalRawFile(octokit, IDS_BASELINE_ROOT_SPEC_PATH);

        if (isIdsProgramme(programme)) {
          if (!programmeRoot) {
            blockers.push(`Missing programme root-spec at \`${programmeRootPath}\`.`);
          } else {
            paths.push(programmeRoot.path);
          }
        } else {
          if (!idsRoot) {
            blockers.push(`Missing IDS baseline root-spec at \`${IDS_BASELINE_ROOT_SPEC_PATH}\`.`);
          } else {
            paths.push(idsRoot.path);
          }
          if (programmeRoot) {
            paths.push(programmeRoot.path);
          }
        }

        const idsTheme = await fetchOptionalRawFile(octokit, IDS_BASELINE_THEME_CSS_PATH);
        const programmeTheme =
          isIdsProgramme(programme)
            ? idsTheme
            : await fetchOptionalRawFile(octokit, programmeThemePath);

        if (!idsTheme && isIdsProgramme(programme)) {
          blockers.push(`Missing theme CSS at \`${IDS_BASELINE_THEME_CSS_PATH}\`.`);
        } else if (!isIdsProgramme(programme) && !idsTheme && !programmeTheme) {
          blockers.push(
            `Missing theme CSS (tried \`${IDS_BASELINE_THEME_CSS_PATH}\` and \`${programmeThemePath}\`).`,
          );
        }

        if (idsTheme) {
          paths.push(idsTheme.path);
        }
        if (programmeTheme && programmeTheme.path !== idsTheme?.path) {
          paths.push(programmeTheme.path);
        }

        const specTextForTokens = [programmeSpec.content, idsBaselineSpec?.content ?? ""].join(
          "\n",
        );
        const seedTokens = extractCssVarNames(specTextForTokens);
        const themeSources = [idsTheme?.content ?? "", programmeTheme?.content ?? ""].join("\n");
        const filtered = filterThemeCssForTokens(themeSources, seedTokens);
        const unresolvedAliases = findUnresolvedComponentAliases(
          filtered.referencedTokens,
          filtered.missingTokens,
        );
        if (unresolvedAliases.length > 0) {
          blockers.push(
            `Theme is missing required layout/alias tokens referenced by the design-spec: ${unresolvedAliases.map((t) => `\`${t}\``).join(", ")}. Define them in theme CSS before lib generation.`,
          );
        }

        const agentContract = await fetchOptionalRawFile(octokit, AGENT_GENERATION_CONTRACT_PATH);
        if (agentContract) {
          paths.push(agentContract.path);
        }

        const contractFile = await fetchFirstAvailableFile(
          octokit,
          resolveComponentContractPaths(programme, componentName),
        );
        if (contractFile) {
          paths.push(contractFile.path);
        }

        const composition = extractMarkdownSections(programmeSpec.content, [
          "Composition & API (runtime)",
          "Anatomy",
          "Codegen Contract (Framework-Agnostic Blueprint)",
          "Layout & Measurements",
          "Tokens",
          "States (Light Theme)",
          "States (Dark Theme)",
          "Interactions",
        ]);

        if (blockers.length > 0) {
          return mcpTextResult(
            buildMetaMarkdown(
              {
                programme,
                componentName,
                framework,
                tool: "get_lib_generation_context",
                ok: false,
                paths,
                blockers,
                missingThemeTokens: filtered.missingTokens,
              },
              [
                `# Lib generation context FAILED: ${programme}/${componentName}`,
                "",
                "Generation must STOP. Do not invent tokens, sizes, or APIs.",
                "",
                "## Blockers",
                ...blockers.map((b) => `- ${b}`),
                "",
                filtered.missingTokens.length > 0
                  ? `All missing token names from spec: ${filtered.missingTokens.map((t) => `\`${t}\``).join(", ")}`
                  : "",
              ]
                .filter(Boolean)
                .join("\n"),
            ),
            true,
          );
        }

        const parts: string[] = [
          `# Lib Generation Context: ${programme}/${componentName}`,
          "",
          "**Mode:** pixel-perfect `lib/` codegen. Generate ONLY from this pack. No hallucination.",
          "",
          buildLibOutputInstructions(programme, componentName, framework),
          "",
          "## Hard rules",
          "- Use CSS variables from the filtered theme slice / design-spec only; never hardcode hex/px when a token exists.",
          "- Implement the full variant/state matrix and validation checklist from the design-spec.",
          "- If something is absent from this pack, treat it as unspecified — ask or fail; do not invent.",
          "- Peer components: follow **Component dependencies (resolved)** only — assets ≠ automatic peers.",
          "",
        ];

        const depReport = await resolveSpecDependencies(
          octokit,
          [programmeSpec.content, idsBaselineSpec?.content ?? ""],
          programme,
          framework,
        );
        parts.push(formatDependencyReportMarkdown(depReport));

        if (agentContract) {
          parts.push(
            "## Agent Generation Contract",
            `Source: \`${agentContract.path}\``,
            "",
            agentContract.content,
            "",
          );
        }

        if (idsBaselineSpec) {
          parts.push(
            "## IDS Baseline Design Specification",
            `Source: \`${idsBaselineSpec.path}\``,
            "",
            idsBaselineSpec.content,
            "",
          );
        }

        parts.push(
          "## Programme Design Specification",
          `Source: \`${programmeSpec.path}\``,
          "",
          programmeSpec.content,
          "",
        );

        if (idsRoot && (!programmeRoot || idsRoot.path !== programmeRoot.path)) {
          parts.push(
            "## IDS Baseline Root Specification",
            `Source: \`${idsRoot.path}\``,
            "",
            idsRoot.content,
            "",
          );
        }
        if (programmeRoot) {
          parts.push(
            "## Programme Root Specification",
            `Source: \`${programmeRoot.path}\``,
            "",
            programmeRoot.content,
            "",
          );
        }

        parts.push(
          "## Filtered Theme CSS (spec-referenced tokens + alias chain)",
          `Referenced tokens: ${filtered.referencedTokens.length}; included declarations: ${filtered.includedTokens.length}.`,
          "",
          "```css",
          filtered.css,
          "```",
          "",
          "## Critical sections (extracted for generation)",
          "",
          ...composition.found.flatMap((s) => [s.body, ""]),
        );

        if (contractFile) {
          parts.push(
            "## Component contract (machine mirror)",
            `Source: \`${contractFile.path}\``,
            "",
            "```ts",
            contractFile.content,
            "```",
            "",
          );
        }

        return mcpTextResult(
          buildMetaMarkdown(
            {
              programme,
              componentName,
              framework,
              tool: "get_lib_generation_context",
              ok: true,
              paths,
              referencedTokenCount: filtered.referencedTokens.length,
              includedTokenCount: filtered.includedTokens.length,
              missingThemeTokens: filtered.missingTokens,
              dependencyAction: depReport.dependencyAction,
              dependencyDeclarationSource: depReport.declarationSource,
              dependencyCount: depReport.resolved.length,
              askUserDependencies: depReport.askUser.map((d) => d.id),
              libOutputHint:
                framework === "angular"
                  ? `lib/angular/${programme.toLowerCase()}/${componentName}/`
                  : `lib/react/${programme.toLowerCase()}/${componentName}/`,
            },
            parts.join("\n").trimEnd(),
          ),
        );
      } catch (error) {
        if (isNotFoundError(error)) {
          return mcpTextResult(
            await notFoundDesignSpecMessage(octokit, programme, componentName, programmeDesignSpecPath),
            true,
          );
        }
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "get_lib_generation_context",
            path: programmeDesignSpecPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "resolve_component_dependencies",
    {
      title: "Resolve Component Dependencies",
      description:
        "Resolves spec-declared dependencies for a component (policy: declare-only). Reads `### Component dependencies (codegen)` when present; otherwise asset-only fallback from Asset resolution (e.g. iconSlug). Checks whether named peer design-specs and lib/ paths exist. Never invents peers from free prose. Prefer calling via get_lib_generation_context for full codegen; use this tool for a focused dependency check. Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
        componentName: componentNameSchema,
        framework: frameworkSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, componentName, framework = "react" }) => {
      const octokit = createOctokit();
      const programmeDesignSpecPath = `components/${programme}/${componentName}/${DESIGN_SPEC_FILENAME}`;
      try {
        const programmeSpec = await fetchProgrammeDesignSpec(octokit, programme, componentName);
        let idsBaselineSpec: FetchedFile | null = null;
        if (programmeRequiresIdsBaseline(programme)) {
          idsBaselineSpec = await resolveIdsBaselineDesignSpec(octokit, programme, componentName);
        }
        const report = await resolveSpecDependencies(
          octokit,
          [programmeSpec.content, idsBaselineSpec?.content ?? ""],
          programme,
          framework,
        );
        const paths = [programmeSpec.path];
        if (idsBaselineSpec) {
          paths.push(idsBaselineSpec.path);
        }
        const body = [
          `# Dependencies: ${programme}/${componentName}`,
          "",
          formatDependencyReportMarkdown(report),
          "## Declared rows (JSON)",
          "```json",
          JSON.stringify(report.resolved, null, 2),
          "```",
        ].join("\n");

        return mcpTextResult(
          buildMetaMarkdown(
            {
              programme,
              componentName,
              framework,
              tool: "resolve_component_dependencies",
              ok: true,
              paths,
              dependencyAction: report.dependencyAction,
              dependencyDeclarationSource: report.declarationSource,
              dependencyCount: report.resolved.length,
              askUserDependencies: report.askUser.map((d) => d.id),
            },
            body,
          ),
        );
      } catch (error) {
        if (isNotFoundError(error)) {
          return mcpTextResult(
            await notFoundDesignSpecMessage(octokit, programme, componentName, programmeDesignSpecPath),
            true,
          );
        }
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "resolve_component_dependencies",
            path: programmeDesignSpecPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_design_spec_section",
    {
      title: "Get Design Spec Section",
      description:
        "Extract one or more ## sections from a component design-spec.md (and IDS baseline when programme is not ids). Use for targeted design details without loading the full theme CSS dump. Section names accept aliases (e.g. composition, states, tokens).",
      inputSchema: {
        programme: programmeSchema,
        componentName: componentNameSchema,
        sections: z
          .union([z.string(), z.array(z.string()).min(1)])
          .describe(
            "Section title(s) or aliases, e.g. Tokens, States, Composition & API, Layout & Measurements",
          ),
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, componentName, sections }) => {
      const octokit = createOctokit();
      const requested = normalizeSectionList(sections);
      const programmeDesignSpecPath = `components/${programme}/${componentName}/${DESIGN_SPEC_FILENAME}`;

      try {
        const programmeSpec = await fetchProgrammeDesignSpec(octokit, programme, componentName);
        const programmeExtract = extractMarkdownSections(programmeSpec.content, requested);

        const extraBlocks: string[] = [];
        let baselinePath: string | undefined;
        let baselineExtract:
          | ReturnType<typeof extractMarkdownSections>
          | undefined;

        if (programmeRequiresIdsBaseline(programme)) {
          const baseline = await resolveIdsBaselineDesignSpec(octokit, programme, componentName);
          if (baseline) {
            baselinePath = baseline.path;
            baselineExtract = extractMarkdownSections(baseline.content, requested);
            if (baselineExtract.found.length > 0) {
              extraBlocks.push(
                `## IDS Baseline Sections (from \`${baseline.path}\`)`,
                "",
                ...baselineExtract.found.flatMap((s) => [s.body, ""]),
              );
            }
          }
        }

        if (programmeExtract.found.length === 0 && !baselineExtract?.found.length) {
          return mcpTextResult(
            formatExtractedSections({
              meta: {
                programme,
                componentName,
                paths: [programmeSpec.path, ...(baselinePath ? [baselinePath] : [])],
              },
              found: [],
              missing: requested,
              available: programmeExtract.available,
            }),
            true,
          );
        }

        return mcpTextResult(
          formatExtractedSections({
            meta: {
              programme,
              componentName,
              paths: [programmeSpec.path, ...(baselinePath ? [baselinePath] : [])],
            },
            found: programmeExtract.found,
            missing: programmeExtract.missing,
            available: programmeExtract.available,
            extraBlocks,
          }),
        );
      } catch (error) {
        if (isNotFoundError(error)) {
          return mcpTextResult(
            await notFoundDesignSpecMessage(octokit, programme, componentName, programmeDesignSpecPath),
            true,
          );
        }
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "get_design_spec_section",
            path: programmeDesignSpecPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_composition_api",
    {
      title: "Get Composition & API",
      description:
        "IDE API reference: returns Composition & API (runtime) and Anatomy from design-spec.md. Use when documenting or implementing props, events, and composition trees. Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
        componentName: componentNameSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, componentName }) => {
      const octokit = createOctokit();
      const programmeDesignSpecPath = `components/${programme}/${componentName}/${DESIGN_SPEC_FILENAME}`;

      try {
        const programmeSpec = await fetchProgrammeDesignSpec(octokit, programme, componentName);
        const extract = extractMarkdownSections(programmeSpec.content, [
          "Composition & API (runtime)",
          "Anatomy",
        ]);

        const extraBlocks: string[] = [];
        if (programmeRequiresIdsBaseline(programme)) {
          const baseline = await resolveIdsBaselineDesignSpec(octokit, programme, componentName);
          if (baseline) {
            const baselineExtract = extractMarkdownSections(baseline.content, [
              "Composition & API (runtime)",
              "Anatomy",
            ]);
            if (baselineExtract.found.length > 0) {
              extraBlocks.push(
                `## IDS Baseline Composition & Anatomy (from \`${baseline.path}\`)`,
                "",
                ...baselineExtract.found.flatMap((s) => [s.body, ""]),
              );
            }
          }
        }

        if (extract.found.length === 0 && extraBlocks.length === 0) {
          return mcpTextResult(
            formatExtractedSections({
              meta: { programme, componentName, paths: [programmeSpec.path] },
              found: [],
              missing: ["Composition & API (runtime)", "Anatomy"],
              available: listSectionTitles(programmeSpec.content),
            }),
            true,
          );
        }

        return mcpTextResult(
          formatExtractedSections({
            meta: { programme, componentName, paths: [programmeSpec.path] },
            found: extract.found,
            missing: extract.missing,
            extraBlocks,
          }),
        );
      } catch (error) {
        if (isNotFoundError(error)) {
          return mcpTextResult(
            await notFoundDesignSpecMessage(octokit, programme, componentName, programmeDesignSpecPath),
            true,
          );
        }
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "get_composition_api",
            path: programmeDesignSpecPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_component_states",
    {
      title: "Get Component States",
      description:
        "Returns States (Light Theme) and States (Dark Theme) matrices from design-spec.md for styling/state generation. Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
        componentName: componentNameSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, componentName }) => {
      const octokit = createOctokit();
      const programmeDesignSpecPath = `components/${programme}/${componentName}/${DESIGN_SPEC_FILENAME}`;

      try {
        const programmeSpec = await fetchProgrammeDesignSpec(octokit, programme, componentName);
        const extract = extractMarkdownSections(programmeSpec.content, [
          "States (Light Theme)",
          "States (Dark Theme)",
        ]);

        const extraBlocks: string[] = [];
        if (programmeRequiresIdsBaseline(programme)) {
          const baseline = await resolveIdsBaselineDesignSpec(octokit, programme, componentName);
          if (baseline) {
            const baselineExtract = extractMarkdownSections(baseline.content, [
              "States (Light Theme)",
              "States (Dark Theme)",
            ]);
            if (baselineExtract.found.length > 0) {
              extraBlocks.push(
                `## IDS Baseline States (from \`${baseline.path}\`)`,
                "",
                ...baselineExtract.found.flatMap((s) => [s.body, ""]),
              );
            }
          }
        }

        if (extract.found.length === 0 && extraBlocks.length === 0) {
          return mcpTextResult(
            formatExtractedSections({
              meta: { programme, componentName, paths: [programmeSpec.path] },
              found: [],
              missing: ["States (Light Theme)", "States (Dark Theme)"],
              available: listSectionTitles(programmeSpec.content),
            }),
            true,
          );
        }

        return mcpTextResult(
          formatExtractedSections({
            meta: { programme, componentName, paths: [programmeSpec.path] },
            found: extract.found,
            missing: extract.missing,
            extraBlocks,
          }),
        );
      } catch (error) {
        if (isNotFoundError(error)) {
          return mcpTextResult(
            await notFoundDesignSpecMessage(octokit, programme, componentName, programmeDesignSpecPath),
            true,
          );
        }
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "get_component_states",
            path: programmeDesignSpecPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_component_tokens",
    {
      title: "Get Component Tokens",
      description:
        "Returns Tokens and Layout & Measurements from design-spec.md (spacing, size, color, radius for the component). Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
        componentName: componentNameSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, componentName }) => {
      const octokit = createOctokit();
      const programmeDesignSpecPath = `components/${programme}/${componentName}/${DESIGN_SPEC_FILENAME}`;

      try {
        const programmeSpec = await fetchProgrammeDesignSpec(octokit, programme, componentName);
        const extract = extractMarkdownSections(programmeSpec.content, [
          "Tokens",
          "Layout & Measurements",
        ]);

        const extraBlocks: string[] = [];
        if (programmeRequiresIdsBaseline(programme)) {
          const baseline = await resolveIdsBaselineDesignSpec(octokit, programme, componentName);
          if (baseline) {
            const baselineExtract = extractMarkdownSections(baseline.content, [
              "Tokens",
              "Layout & Measurements",
            ]);
            if (baselineExtract.found.length > 0) {
              extraBlocks.push(
                `## IDS Baseline Tokens / Layout (from \`${baseline.path}\`)`,
                "",
                ...baselineExtract.found.flatMap((s) => [s.body, ""]),
              );
            }
          }
        }

        if (extract.found.length === 0 && extraBlocks.length === 0) {
          return mcpTextResult(
            formatExtractedSections({
              meta: { programme, componentName, paths: [programmeSpec.path] },
              found: [],
              missing: ["Tokens", "Layout & Measurements"],
              available: listSectionTitles(programmeSpec.content),
            }),
            true,
          );
        }

        return mcpTextResult(
          formatExtractedSections({
            meta: { programme, componentName, paths: [programmeSpec.path] },
            found: extract.found,
            missing: extract.missing,
            extraBlocks,
          }),
        );
      } catch (error) {
        if (isNotFoundError(error)) {
          return mcpTextResult(
            await notFoundDesignSpecMessage(octokit, programme, componentName, programmeDesignSpecPath),
            true,
          );
        }
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "get_component_tokens",
            path: programmeDesignSpecPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_foundation_tokens",
    {
      title: "Get Foundation Tokens",
      description:
        "Programme-wide foundations from root-spec.md (color, spacing, typography, elevation, radius, etc.) plus an optional filtered slice of programme theme CSS. For non-IDS programmes also includes IDS baseline root-spec. Category defaults to all. Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
        category: foundationCategorySchema,
        includeThemeCss: z
          .boolean()
          .default(true)
          .describe("When true, append filtered theme CSS custom properties for the category"),
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, category = "all", includeThemeCss = true }) => {
      const octokit = createOctokit();
      const sectionTitles = FOUNDATION_CATEGORY_SECTIONS[category] ?? FOUNDATION_CATEGORY_SECTIONS.all;
      const programmeRootPath = resolveProgrammeRootSpecPath(programme);
      const programmeThemePath = resolveProgrammeThemeCssPath(programme);

      try {
        const programmeRoot = await fetchOptionalRawFile(octokit, programmeRootPath);
        const parts: string[] = [];
        const paths: string[] = [];
        const sectionsReturned: string[] = [];

        if (programmeRequiresIdsBaseline(programme)) {
          const idsRoot = await fetchOptionalRawFile(octokit, IDS_BASELINE_ROOT_SPEC_PATH);
          if (idsRoot) {
            paths.push(idsRoot.path);
            const extract = extractExactTitles(idsRoot.content, sectionTitles);
            parts.push(`## IDS Baseline Foundations (from \`${idsRoot.path}\`)`, "");
            for (const section of extract.found) {
              parts.push(section.body, "");
              sectionsReturned.push(`ids:${section.title}`);
            }
          }
        }

        if (programmeRoot) {
          paths.push(programmeRoot.path);
          const extract = extractExactTitles(programmeRoot.content, sectionTitles);
          parts.push(`## Programme Foundations (from \`${programmeRoot.path}\`)`, "");
          for (const section of extract.found) {
            parts.push(section.body, "");
            sectionsReturned.push(`${programme}:${section.title}`);
          }
          if (extract.found.length === 0) {
            parts.push(
              `_No matching foundation sections in programme root-spec. Available: ${listSectionTitles(programmeRoot.content).join(", ")}_`,
              "",
            );
          }
        } else if (!programmeRequiresIdsBaseline(programme)) {
          return mcpTextResult(
            `404 Not Found: root specification \`${programmeRootPath}\` does not exist.`,
            true,
          );
        }

        if (includeThemeCss) {
          const themeFiles: FetchedFile[] = [];
          if (programmeRequiresIdsBaseline(programme)) {
            const idsTheme = await fetchOptionalRawFile(octokit, IDS_BASELINE_THEME_CSS_PATH);
            if (idsTheme) {
              themeFiles.push(idsTheme);
            }
          }
          const programmeTheme = await fetchOptionalRawFile(octokit, programmeThemePath);
          if (programmeTheme) {
            themeFiles.push(programmeTheme);
          }

          for (const theme of themeFiles) {
            paths.push(theme.path);
            const filtered = filterThemeCssByCategory(theme.content, category);
            parts.push(
              `## Theme CSS slice (\`${theme.path}\`, category=${category})`,
              "",
              "```css",
              filtered,
              "```",
              "",
            );
          }
        }

        if (parts.length === 0) {
          return mcpTextResult(
            `No foundation content found for programme \`${programme}\` category \`${category}\`.`,
            true,
          );
        }

        return mcpTextResult(
          buildMetaMarkdown(
            { programme, category, includeThemeCss, paths, sectionsReturned },
            parts.join("\n").trimEnd(),
          ),
        );
      } catch (error) {
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "get_foundation_tokens",
            path: programmeRootPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_design_principles",
    {
      title: "Get Design Principles",
      description:
        "Global design principles and rules from root-spec.md (identity, interaction, accessibility, theming, codegen baseline). Use before implementing behaviour that must follow programme-wide rules. Programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME }) => {
      const octokit = createOctokit();
      const programmeRootPath = resolveProgrammeRootSpecPath(programme);
      const titles = [...DESIGN_PRINCIPLES_SECTIONS];

      try {
        const parts: string[] = [];
        const paths: string[] = [];
        const sectionsReturned: string[] = [];

        if (programmeRequiresIdsBaseline(programme)) {
          const idsRoot = await fetchOptionalRawFile(octokit, IDS_BASELINE_ROOT_SPEC_PATH);
          if (idsRoot) {
            paths.push(idsRoot.path);
            const extract = extractExactTitles(idsRoot.content, titles);
            parts.push(`## IDS Baseline Principles (from \`${idsRoot.path}\`)`, "");
            for (const section of extract.found) {
              parts.push(section.body, "");
              sectionsReturned.push(`ids:${section.title}`);
            }
          }
        }

        const programmeRoot = await fetchOptionalRawFile(octokit, programmeRootPath);
        if (programmeRoot) {
          paths.push(programmeRoot.path);
          const extract = extractExactTitles(programmeRoot.content, titles);
          parts.push(`## Programme Principles (from \`${programmeRoot.path}\`)`, "");
          for (const section of extract.found) {
            parts.push(section.body, "");
            sectionsReturned.push(`${programme}:${section.title}`);
          }
          if (extract.found.length === 0) {
            parts.push(
              `_No matching principle sections. Available: ${listSectionTitles(programmeRoot.content).join(", ")}_`,
              "",
            );
          }
        } else if (isIdsProgramme(programme)) {
          return mcpTextResult(
            `404 Not Found: root specification \`${programmeRootPath}\` does not exist.`,
            true,
          );
        }

        if (parts.length === 0) {
          return mcpTextResult(`No design principles found for programme \`${programme}\`.`, true);
        }

        return mcpTextResult(
          buildMetaMarkdown({ programme, paths, sectionsReturned }, parts.join("\n").trimEnd()),
        );
      } catch (error) {
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "get_design_principles",
            path: programmeRootPath,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "get_usage_examples",
    {
      title: "Get Usage Examples",
      description:
        "Storybook Docs / developer usage guides (*.developer-usage.ts|js). Falls back to Storybook companion story file when developer-usage is missing. Use for IDE reference documentation and usage patterns. Framework defaults to react; programme defaults to ids.",
      inputSchema: {
        programme: programmeSchema,
        componentName: componentNameSchema,
        framework: frameworkSchema,
      },
    },
    async ({ programme = DEFAULT_PROGRAMME, componentName, framework = "react" }) => {
      const octokit = createOctokit();

      try {
        const usage = await fetchDeveloperUsageFile(octokit, programme, componentName, framework);
        if (usage) {
          return mcpTextResult(
            buildMetaMarkdown(
              {
                programme,
                componentName,
                framework,
                source: "developer-usage",
                path: usage.path,
              },
              [`# Usage Examples: ${programme}/${componentName}`, "", `Source: \`${usage.path}\``, "", usage.content].join(
                "\n",
              ),
            ),
          );
        }

        const storybook = await fetchCompanionStorybookFile(
          octokit,
          programme,
          componentName,
          framework,
        );
        if (storybook) {
          return mcpTextResult(
            buildMetaMarkdown(
              {
                programme,
                componentName,
                framework,
                source: "storybook-companion",
                path: storybook.path,
                note: "No *.developer-usage file found; returning Storybook companion story as fallback.",
              },
              [
                `# Usage Examples (Storybook fallback): ${programme}/${componentName}`,
                "",
                `Source: \`${storybook.path}\``,
                "",
                storybook.content,
              ].join("\n"),
            ),
          );
        }

        const tried = buildDeveloperUsageCandidatePaths(programme, componentName, framework);
        return mcpTextResult(
          buildMetaMarkdown(
            {
              programme,
              componentName,
              framework,
              source: null,
              triedDeveloperUsagePaths: tried.slice(0, 12),
            },
            `_No Storybook Docs (developer-usage) or Storybook companion story found for \`${programme}/${componentName}\` (${framework})._`,
          ),
          true,
        );
      } catch (error) {
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "get_usage_examples",
            path: `components/${programme}/${componentName}`,
          }),
          true,
        );
      }
    },
  );

  server.registerTool(
    "search_registry",
    {
      title: "Search Component Registry",
      description:
        "Find components by name/slug across programmes and report inheritance baseline mappings from programme-inheritance-registry.json.",
      inputSchema: {
        query: z.string().min(1).describe("Component name or slug substring to search"),
        programme: z
          .string()
          .min(1)
          .regex(/^[a-zA-Z0-9._-]+$/, "programme contains invalid characters")
          .optional()
          .describe("Optional: limit search to one programme folder"),
      },
    },
    async ({ query, programme }) => {
      const octokit = createOctokit();
      const needle = query.trim().toLowerCase();

      try {
        const programmes = programme
          ? [programme]
          : (await listProgrammeDirectories(octokit)).filter(
              (name) => !name.endsWith("-theme.css") && !name.includes("."),
            );

        const matches: Array<{
          programme: string;
          slug: string;
          path: string;
          idsBaselineSlug?: string;
          idsBaselineSpecPath?: string;
        }> = [];

        const registry = await loadInheritanceRegistry(octokit);

        for (const prog of programmes) {
          let slugs: string[];
          try {
            slugs = await listDirectoryEntries(octokit, `components/${prog}`);
          } catch (error) {
            if (isNotFoundError(error)) {
              continue;
            }
            throw error;
          }

          for (const slug of slugs) {
            if (!slug.toLowerCase().includes(needle) && !needle.includes(slug.toLowerCase())) {
              continue;
            }
            const entry = findInheritanceRegistryEntry(registry, prog, slug);
            matches.push({
              programme: prog,
              slug,
              path: `components/${prog}/${slug}/${DESIGN_SPEC_FILENAME}`,
              ...(entry?.idsBaselineSlug ? { idsBaselineSlug: entry.idsBaselineSlug } : {}),
              ...(entry?.idsBaselineSpecPath
                ? { idsBaselineSpecPath: entry.idsBaselineSpecPath }
                : {}),
            });
          }
        }

        // Also surface registry entries whose slug/baseline matches even if folder listing missed them
        if (registry?.components) {
          for (const entry of registry.components) {
            if (programme && normalizeProgrammeSlug(entry.programme) !== normalizeProgrammeSlug(programme)) {
              continue;
            }
            const hay = `${entry.slug} ${entry.idsBaselineSlug ?? ""}`.toLowerCase();
            if (!hay.includes(needle)) {
              continue;
            }
            const already = matches.some(
              (m) =>
                normalizeProgrammeSlug(m.programme) === normalizeProgrammeSlug(entry.programme) &&
                m.slug === entry.slug,
            );
            if (!already) {
              matches.push({
                programme: entry.programme,
                slug: entry.slug,
                path: `components/${entry.programme}/${entry.slug}/${DESIGN_SPEC_FILENAME}`,
                ...(entry.idsBaselineSlug ? { idsBaselineSlug: entry.idsBaselineSlug } : {}),
                ...(entry.idsBaselineSpecPath
                  ? { idsBaselineSpecPath: entry.idsBaselineSpecPath }
                  : {}),
              });
            }
          }
        }

        let suggestions: string[] = [];
        if (matches.length === 0) {
          const progForSuggest = programme ?? DEFAULT_PROGRAMME;
          suggestions = await suggestComponentSlugs(octokit, progForSuggest, query);
        }

        return mcpTextResult(
          JSON.stringify(
            {
              query,
              programmeFilter: programme ?? null,
              count: matches.length,
              matches,
              ...(suggestions.length > 0 ? { suggestions } : {}),
            },
            null,
            2,
          ),
        );
      } catch (error) {
        return mcpTextResult(
          formatGitHubApiError(error, {
            operation: "search_registry",
            path: programme ? `components/${programme}` : "components",
          }),
          true,
        );
      }
    },
  );

  registerSddResources(server);

  return server;
}

function registerSddResources(server: McpServer): void {
  server.registerResource(
    "programmes",
    "sdd://programmes",
    {
      title: "Programmes",
      description: "Lists design-system programmes under components/ on the configured GitHub ref",
      mimeType: "application/json",
    },
    async (uri) => {
      const octokit = createOctokit();
      const programmes = await listProgrammeDirectories(octokit);
      const body = {
        programmes,
        defaultProgramme: DEFAULT_PROGRAMME,
        ref: getGitHubConfig().ref ?? null,
        repo: getGitHubConfig().repoSlug,
      };
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(body, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "programme-components",
    new ResourceTemplate("sdd://documentation/{programme}/components", {
      list: undefined,
      complete: {
        programme: async () => {
          try {
            return await listProgrammeDirectories(createOctokit());
          } catch {
            return [DEFAULT_PROGRAMME];
          }
        },
      },
    }),
    {
      title: "Programme component list",
      description: "Lists component slugs for a programme",
      mimeType: "application/json",
    },
    async (uri, variables) => {
      const programme = String(variables.programme ?? DEFAULT_PROGRAMME);
      const octokit = createOctokit();
      const components = await listDirectoryEntries(octokit, `components/${programme}`);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify({ programme, components, count: components.length }, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "component-design-spec",
    new ResourceTemplate("sdd://documentation/{programme}/components/{slug}", {
      list: undefined,
      complete: {
        programme: async () => {
          try {
            return await listProgrammeDirectories(createOctokit());
          } catch {
            return [DEFAULT_PROGRAMME];
          }
        },
      },
    }),
    {
      title: "Component design-spec",
      description: "Full design-spec.md for a programme component (plus IDS baseline when applicable)",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const programme = String(variables.programme ?? DEFAULT_PROGRAMME);
      const slug = String(variables.slug ?? "");
      if (!slug) {
        return {
          contents: [{ uri: uri.href, mimeType: "text/plain", text: "Missing slug in resource URI." }],
        };
      }
      const octokit = createOctokit();
      try {
        const programmeSpec = await fetchProgrammeDesignSpec(octokit, programme, slug);
        const parts: string[] = [`# Design Spec: ${programme}/${slug}`, ""];
        if (programmeRequiresIdsBaseline(programme)) {
          const baseline = await resolveIdsBaselineDesignSpec(octokit, programme, slug);
          if (baseline) {
            parts.push(
              `## IDS Baseline`,
              `Source: \`${baseline.path}\``,
              "",
              baseline.content,
              "",
              `## Programme`,
              `Source: \`${programmeSpec.path}\``,
              "",
              programmeSpec.content,
            );
          } else {
            parts.push(`Source: \`${programmeSpec.path}\``, "", programmeSpec.content);
          }
        } else {
          parts.push(`Source: \`${programmeSpec.path}\``, "", programmeSpec.content);
        }
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/markdown",
              text: parts.join("\n"),
            },
          ],
        };
      } catch (error) {
        const msg = isNotFoundError(error)
          ? await notFoundDesignSpecMessage(
              octokit,
              programme,
              slug,
              `components/${programme}/${slug}/${DESIGN_SPEC_FILENAME}`,
            )
          : formatGitHubApiError(error, {
              operation: "resource component-design-spec",
              path: `components/${programme}/${slug}/${DESIGN_SPEC_FILENAME}`,
            });
        return {
          contents: [{ uri: uri.href, mimeType: "text/plain", text: msg }],
        };
      }
    },
  );

  server.registerResource(
    "programme-foundations",
    new ResourceTemplate("sdd://documentation/{programme}/foundations/{category}", {
      list: undefined,
      complete: {
        programme: async () => {
          try {
            return await listProgrammeDirectories(createOctokit());
          } catch {
            return [DEFAULT_PROGRAMME];
          }
        },
        category: async () => [...FOUNDATION_CATEGORIES, "all"],
      },
    }),
    {
      title: "Programme foundations",
      description: "Foundation sections from root-spec for a category (color, spacing, typography, …)",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const programme = String(variables.programme ?? DEFAULT_PROGRAMME);
      const category = String(variables.category ?? "all");
      const sectionTitles =
        FOUNDATION_CATEGORY_SECTIONS[category] ?? FOUNDATION_CATEGORY_SECTIONS.all;
      const octokit = createOctokit();
      const parts: string[] = [`# Foundations: ${programme} / ${category}`, ""];

      if (programmeRequiresIdsBaseline(programme)) {
        const idsRoot = await fetchOptionalRawFile(octokit, IDS_BASELINE_ROOT_SPEC_PATH);
        if (idsRoot) {
          const extract = extractExactTitles(idsRoot.content, sectionTitles);
          parts.push(`## IDS Baseline (\`${idsRoot.path}\`)`, "");
          for (const section of extract.found) {
            parts.push(section.body, "");
          }
        }
      }

      const programmeRoot = await fetchOptionalRawFile(octokit, resolveProgrammeRootSpecPath(programme));
      if (programmeRoot) {
        const extract = extractExactTitles(programmeRoot.content, sectionTitles);
        parts.push(`## Programme (\`${programmeRoot.path}\`)`, "");
        for (const section of extract.found) {
          parts.push(section.body, "");
        }
      } else if (isIdsProgramme(programme)) {
        parts.push(`_Root spec not found at \`${resolveProgrammeRootSpecPath(programme)}\`._`);
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: parts.join("\n").trimEnd(),
          },
        ],
      };
    },
  );
}

const app = express();

const MCP_CORS_HEADERS = [
  "Content-Type",
  "Accept",
  "Authorization",
  "mcp-session-id",
  "MCP-Protocol-Version",
  "Last-Event-ID",
];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", MCP_CORS_HEADERS.join(", "));
  res.setHeader("Access-Control-Expose-Headers", "mcp-session-id");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: "4mb" }));

function respondOAuthNotSupported(req: Request, res: Response): void {
  res.status(404).json({
    error: "oauth_not_supported",
    message:
      "This MCP server does not use OAuth. GitHub auth is server-side via GITHUB_PERSONAL_ACCESS_TOKEN. Connect with Streamable HTTP and no OAuth.",
    path: req.path,
  });
}

// Inspector / Cursor may probe OAuth on connect — return JSON (not HTML) so clients can skip OAuth.
app.get("/.well-known/oauth-authorization-server", respondOAuthNotSupported);
app.get(/^\/\.well-known\/oauth-protected-resource(\/.*)?$/, respondOAuthNotSupported);
app.get("/.well-known/openid-configuration", respondOAuthNotSupported);
app.post("/register", respondOAuthNotSupported);

app.get("/health", async (req: Request, res: Response) => {
  let github: { host: string; repo: string; ref?: string } | { error: string };
  try {
    const config = getGitHubConfig();
    github = {
      host: config.host,
      repo: config.repoSlug,
      ...(config.ref ? { ref: config.ref } : {}),
    };
  } catch (error) {
    github = { error: error instanceof Error ? error.message : "GitHub config unavailable" };
  }

  const payload: Record<string, unknown> = {
    status: "ok",
    service: "sdd-ids-design-spec-mcp-server",
    endpoint: "/mcp",
    githubTlsVerify: shouldVerifyGitHubTls(),
    githubEnterprise: github,
  };

  if (req.query.probe === "github") {
    try {
      requireGitHubToken();
      const probe = await probeGitHubConnectivity();
      payload.githubProbe = probe;
    } catch (error) {
      payload.githubProbe = {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  res.status(200).json(payload);
});

app.all("/mcp", async (req: Request, res: Response) => {
  try {
    const sessionId = getSessionId(req);

    if (sessionId) {
      const session = sessions.get(sessionId);
      if (!session) {
        res.status(404).json({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Session not found" },
          id: null,
        });
        return;
      }

      await session.transport.handleRequest(req, res, req.body);
      return;
    }

    if (req.method === "POST" && isInitializeRequest(req.body)) {
      const server = createMcpServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid) => {
          sessions.set(sid, { transport, server });
        },
      });

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (!sid) {
          return;
        }
        const existing = sessions.get(sid);
        if (existing) {
          void existing.server.close();
          sessions.delete(sid);
        }
      };

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    }

    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: No valid session ID. POST an initialize request first.",
      },
      id: null,
    });
  } catch (error) {
    if (!res.headersSent) {
      const message = error instanceof Error ? error.message : "Internal MCP transport error";
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message },
        id: null,
      });
    }
  }
});

async function main(): Promise<void> {
  try {
    sanitizeNodeExtraCaCerts();
    requireGitHubToken();
    const config = getGitHubConfig();
    const tlsVerify = shouldVerifyGitHubTls();

    app.listen(PORT, HOST, () => {
      console.log(`MCP server listening on http://${HOST}:${PORT}/mcp`);
      console.log(`Health check available at http://${HOST}:${PORT}/health`);
      console.log(`GitHub probe: http://${HOST}:${PORT}/health?probe=github`);
      console.log(`GitHub Enterprise: ${config.host}`);
      console.log(`Repository: ${config.repoSlug}`);
      console.log(`Contents ref: ${config.ref ?? "(repository default branch)"}`);
      console.log(`GitHub TLS verify: ${tlsVerify}`);
      if (!tlsVerify) {
        console.warn(
          "WARNING: TLS certificate verification is disabled for GHES (corporate CA). Set GITHUB_TLS_VERIFY=true to enforce.",
        );
      }

      void probeGitHubConnectivity().then((probe) => {
        if (probe.ok) {
          console.log(probe.message);
          return;
        }
        console.error("GitHub connectivity probe failed:\n" + probe.message);
      });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`FATAL: ${message}`);
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`FATAL: ${message}`);
  process.exit(1);
});
