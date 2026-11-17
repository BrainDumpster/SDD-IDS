import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { RequestError } from "@octokit/request-error";
import { Octokit } from "@octokit/rest";
import { Agent as UndiciAgent, fetch as undiciFetch } from "undici";
import express, { type Request, type Response } from "express";
import { z } from "zod";

const PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const HOST = "0.0.0.0";

const DESIGN_SPEC_FILENAME = "design-spec.md";
const ROOT_SPEC_FILENAME = "root-spec.md";
const IDS_BASELINE_ROOT_SPEC_PATH = "components/ids/root-spec.md";
const IDS_BASELINE_THEME_CSS_PATH = "components/ids-theme.css";
const IDS_BASELINE_COMPONENTS_DIR = "components/ids";
const INHERITANCE_REGISTRY_PATH = "data/programme-inheritance-registry.json";

type Framework = "react" | "angular";

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
  if (trimmed.endsWith("/api/v3")) {
    return trimmed;
  }
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
  .describe("Target framework for Storybook parity lookup (default: react)");

const programmeSchema = z
  .string()
  .min(1, "programme is required")
  .regex(/^[a-zA-Z0-9._-]+$/, "programme contains invalid characters");

const componentNameSchema = z
  .string()
  .min(1, "componentName is required")
  .regex(/^[a-zA-Z0-9._-]+$/, "componentName contains invalid characters");

const REACT_STORYBOOK_EXTENSIONS = [".stories.tsx", ".stories.ts", ".stories.jsx", ".stories.js"] as const;
const ANGULAR_STORYBOOK_EXTENSIONS = [".stories.ts"] as const;

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
    version: "1.0.0",
  });

  server.registerTool(
  "list_components",
  {
    title: "List Components",
    description: "Discovers available UI components across a specific business programme.",
    inputSchema: {
      programme: programmeSchema.describe("Business programme folder under components/ (e.g. ids, synapse, DAP)"),
    },
  },
  async ({ programme }) => {
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

      return {
        content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
      };
    } catch (error) {
      if (isNotFoundError(error)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `404 Not Found: programme directory \`${directoryPath}\` does not exist in ${getGitHubConfig().repoSlug} on GitHub Enterprise.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: formatGitHubApiError(error, {
              operation: "list_components",
              path: directoryPath,
            }),
          },
        ],
        isError: true,
      };
    }
  },
  );

  server.registerTool(
  "get_component_context",
  {
    title: "Get Component Context",
    description:
      "MANDATORY tool to execute before generating or modifying code. Fetches the full deliverable bundle: for IDS — component design-spec, root-spec, and theme CSS; for any other programme — IDS baseline design-spec (resolved via programme-inheritance-registry), IDS root-spec, IDS theme CSS, plus programme design-spec, programme root-spec, programme theme CSS, and framework-specific Storybook parity.",
    inputSchema: {
      programme: programmeSchema.describe("Business programme folder under components/"),
      componentName: componentNameSchema.describe("Component slug folder name under the programme"),
      framework: frameworkSchema,
    },
  },
  async ({ programme, componentName, framework = "react" }) => {
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

      return {
        content: [{ type: "text" as const, text: markdown }],
      };
    } catch (error) {
      if (isNotFoundError(error)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `404 Not Found: programme design specification \`${programmeDesignSpecPath}\` does not exist in ${getGitHubConfig().repoSlug} on GitHub Enterprise.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: formatGitHubApiError(error, {
              operation: "get_component_context",
              path: programmeDesignSpecPath,
            }),
          },
        ],
        isError: true,
      };
    }
  },
  );

  return server;
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
