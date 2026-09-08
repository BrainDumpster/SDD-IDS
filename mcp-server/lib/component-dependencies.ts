/**
 * Spec-declared component / asset dependencies (policy: declare-only, no guessing).
 *
 * Primary source: `### Component dependencies (codegen)` table in design-spec.md.
 * Fallback (assets only): `Asset resolution` bullets with `iconSlug` / `/asset/icons/` paths.
 * Free prose (e.g. "Icon component") is never treated as a named peer.
 */

export type DependencyKind = "asset" | "component";

export type DependencySource =
  | "component-dependencies-table"
  | "asset-resolution-fallback";

export type DependencyResolution =
  | "asset_only"
  | "use_existing"
  | "missing_ask_user"
  | "optional_missing";

export interface DeclaredDependency {
  kind: DependencyKind;
  /** Asset prop/slug name, or peer component folder slug (kebab-case). */
  id: string;
  /** Runtime export when declared, e.g. `IdsIcon`. */
  publicName?: string;
  required: boolean;
  notes?: string;
  assetPathTemplate?: string;
  source: DependencySource;
}

export interface ResolvedDependency extends DeclaredDependency {
  resolution: DependencyResolution;
  designSpecPath?: string;
  designSpecExists?: boolean;
  libPath?: string;
  libExists?: boolean;
  agentAction: string;
}

export interface DependencyReport {
  declarationSource: "table" | "asset-fallback" | "none";
  declared: DeclaredDependency[];
  resolved: ResolvedDependency[];
  askUser: ResolvedDependency[];
  dependencyAction: "clear" | "ask_user";
}

const DEPS_HEADING_RE =
  /^#{2,3}\s+Component dependencies\s*\(codegen\)\s*$/im;

const TABLE_ROW_RE =
  /^\|\s*(asset|component)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/gim;

function stripCell(raw: string): string {
  return raw.replace(/\\\|/g, "|").replace(/\s+/g, " ").trim();
}

function parseRequired(cell: string): boolean {
  const t = cell.toLowerCase();
  if (t.includes("optional")) return false;
  if (t.startsWith("no") || t === "false" || t === "n") return false;
  if (t.includes("required") || t.startsWith("yes") || t === "true" || t === "y") {
    return true;
  }
  // Default: optional (safer — do not invent hard blockers)
  return false;
}

function idsNameToSlug(publicName: string): string | undefined {
  const m = publicName.match(/^Ids([A-Z][A-Za-z0-9]*)$/);
  if (!m) return undefined;
  const body = m[1];
  return body
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/** Parse Id cell: `icon` (`IdsIcon`) | `IdsIcon` | `iconSlug` → `/asset/icons/<iconSlug>.svg` */
export function parseDependencyIdCell(
  kind: DependencyKind,
  cell: string,
): Pick<DeclaredDependency, "id" | "publicName" | "assetPathTemplate"> {
  const text = stripCell(cell).replace(/`/g, "");

  const arrow = text.split(/\s*→\s*|\s*->\s*/);
  let assetPathTemplate: string | undefined;
  let left = text;
  if (arrow.length >= 2) {
    left = arrow[0].trim();
    assetPathTemplate = arrow.slice(1).join("→").trim();
  }

  const named = left.match(/^([a-z0-9][a-z0-9._-]*)\s*\((Ids[A-Z][A-Za-z0-9]*)\)\s*$/);
  if (named) {
    return {
      id: named[1],
      publicName: named[2],
      assetPathTemplate,
    };
  }

  const idsOnly = left.match(/^(Ids[A-Z][A-Za-z0-9]*)$/);
  if (idsOnly) {
    const publicName = idsOnly[1];
    return {
      id: idsNameToSlug(publicName) ?? publicName.toLowerCase(),
      publicName,
      assetPathTemplate,
    };
  }

  const slugOrProp = left.match(/^([a-zA-Z][a-zA-Z0-9._-]*)$/);
  if (slugOrProp) {
    const id = slugOrProp[1];
    if (kind === "component" && id.startsWith("Ids")) {
      return {
        id: idsNameToSlug(id) ?? id.toLowerCase(),
        publicName: id,
        assetPathTemplate,
      };
    }
    return { id, assetPathTemplate };
  }

  // Last resort: keep trimmed left as id (still from the table — not invented)
  return { id: left || "unknown", assetPathTemplate };
}

/**
 * Extract `### Component dependencies (codegen)` table rows.
 * Returns null when the heading is absent (caller may use asset fallback).
 */
export function parseComponentDependenciesTable(
  markdown: string,
): DeclaredDependency[] | null {
  const heading = markdown.match(DEPS_HEADING_RE);
  if (!heading || heading.index === undefined) {
    return null;
  }

  const from = heading.index + heading[0].length;
  const rest = markdown.slice(from);
  const nextHeading = rest.search(/\n#{2,3}\s+/);
  const block = nextHeading >= 0 ? rest.slice(0, nextHeading) : rest;

  const deps: DeclaredDependency[] = [];
  TABLE_ROW_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TABLE_ROW_RE.exec(block)) !== null) {
    const kind = match[1].toLowerCase() as DependencyKind;
    const idCell = stripCell(match[2]);
    // Skip markdown separator rows accidentally matched
    if (/^[-:]+$/.test(idCell.replace(/\s/g, ""))) continue;
    if (idCell.toLowerCase() === "id") continue;

    const parsed = parseDependencyIdCell(kind, idCell);
    deps.push({
      kind,
      id: parsed.id,
      publicName: parsed.publicName,
      required: parseRequired(stripCell(match[3])),
      notes: stripCell(match[4]) || undefined,
      assetPathTemplate: parsed.assetPathTemplate,
      source: "component-dependencies-table",
    });
  }

  return deps;
}

/**
 * Asset-only fallback from Asset resolution sections — never invents component peers.
 */
export function parseAssetResolutionFallback(markdown: string): DeclaredDependency[] {
  const deps: DeclaredDependency[] = [];
  const seen = new Set<string>();

  // iconSlug + path template
  const iconSlugMention = /`iconSlug`/i.test(markdown) || /\biconSlug\b/.test(markdown);
  const pathMatch = markdown.match(
    /`?\/?(?:assets?\/icons\/)<[^`>\s]+>\.svg`?|`?\/?(?:assets?\/icons\/)[^`\s]+`?/i,
  );

  if (iconSlugMention || pathMatch) {
    const template =
      pathMatch?.[0]?.replace(/`/g, "") ?? "/asset/icons/<iconSlug>.svg";
    const key = `asset:iconSlug`;
    if (!seen.has(key)) {
      seen.add(key);
      deps.push({
        kind: "asset",
        id: "iconSlug",
        required: false,
        notes:
          "Parsed from Asset resolution / iconSlug mentions — not a component peer.",
        assetPathTemplate: template.includes("<")
          ? template
          : "/asset/icons/<iconSlug>.svg",
        source: "asset-resolution-fallback",
      });
    }
  }

  // Generic slug → path bullets: Resolve … from `/asset/...`
  const resolveRe =
    /Resolve\s+[^\n]*?from\s+`(\/(?:asset|assets)\/[^`]+)`/gi;
  let m: RegExpExecArray | null;
  while ((m = resolveRe.exec(markdown)) !== null) {
    const template = m[1];
    const id = template.includes("icon") ? "iconSlug" : "asset";
    const key = `asset:${id}:${template}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deps.push({
      kind: "asset",
      id,
      required: false,
      assetPathTemplate: template,
      notes: "Parsed from Asset resolution Resolve…from path.",
      source: "asset-resolution-fallback",
    });
  }

  return deps;
}

/** Prefer formal tables from one or more specs; otherwise asset-resolution fallback only. */
export function extractDeclaredDependencies(markdown: string): {
  declarationSource: DependencyReport["declarationSource"];
  declared: DeclaredDependency[];
} {
  return extractDeclaredDependenciesFromSpecs([markdown]);
}

/**
 * Merge dependencies across programme + IDS baseline specs (inheritance).
 * Table rows win; never invent peers from prose.
 */
export function extractDeclaredDependenciesFromSpecs(markdowns: string[]): {
  declarationSource: DependencyReport["declarationSource"];
  declared: DeclaredDependency[];
} {
  const merged: DeclaredDependency[] = [];
  const seen = new Set<string>();
  let sawTableHeading = false;
  let sawTableRows = false;

  for (const md of markdowns) {
    if (!md?.trim()) continue;
    const table = parseComponentDependenciesTable(md);
    if (table !== null) {
      sawTableHeading = true;
      for (const dep of table) {
        const key = `${dep.kind}:${dep.id}:${dep.assetPathTemplate ?? ""}`;
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(dep);
        sawTableRows = true;
      }
    }
  }

  if (sawTableHeading) {
    return {
      declarationSource: sawTableRows ? "table" : "none",
      declared: merged,
    };
  }

  for (const md of markdowns) {
    if (!md?.trim()) continue;
    const assetSection = extractLooseSection(
      md,
      /asset resolution|bundling contract/i,
    );
    const fallback = parseAssetResolutionFallback(assetSection ?? md);
    for (const dep of fallback) {
      const key = `${dep.kind}:${dep.id}:${dep.assetPathTemplate ?? ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(dep);
    }
  }

  return {
    declarationSource: merged.length > 0 ? "asset-fallback" : "none",
    declared: merged,
  };
}

function extractLooseSection(markdown: string, titleRe: RegExp): string | null {
  const lines = markdown.split(/\n/);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{2,4}\s+/.test(line) && titleRe.test(line)) {
      start = i;
      break;
    }
    if (titleRe.test(line) && /asset resolution/i.test(line)) {
      start = i;
      break;
    }
  }
  if (start < 0) return null;
  const out: string[] = [];
  for (let i = start; i < lines.length; i++) {
    if (i > start && /^#{2,3}\s+/.test(lines[i])) break;
    out.push(lines[i]);
  }
  return out.join("\n");
}

export function resolveLibPath(
  framework: "react" | "angular",
  programme: string,
  slug: string,
): string {
  const programmeDir = programme; // case-sensitive folder under lib
  if (framework === "angular") {
    return `lib/angular/${programmeDir.toLowerCase()}/${slug}`;
  }
  return `lib/react/${programmeDir.toLowerCase()}/${slug}`;
}

export function resolveDesignSpecPath(programme: string, slug: string): string {
  return `components/${programme}/${slug}/design-spec.md`;
}

export function agentActionFor(resolution: DependencyResolution): string {
  switch (resolution) {
    case "asset_only":
      return "Implement asset handling inside the requested component per the asset contract. Do not treat as a peer component unless a component row is also declared.";
    case "use_existing":
      return "Import / refer to the existing lib component. Do not reimplement.";
    case "missing_ask_user":
      return "STOP and ask the user: implement this peer with the requested component, defer, or keep slot-only.";
    case "optional_missing":
      return "Peer optional and missing — keep slot/projection only unless the user asks to implement the peer.";
    default:
      return "Follow the design-spec; do not invent dependencies.";
  }
}

export function resolveDeclaredDependencies(
  declared: DeclaredDependency[],
  opts: {
    programme: string;
    framework: "react" | "angular";
    designSpecExists: (path: string) => boolean | Promise<boolean>;
    libExists: (path: string) => boolean | Promise<boolean>;
  },
): Promise<ResolvedDependency[]> {
  return Promise.all(
    declared.map(async (dep) => {
      if (dep.kind === "asset") {
        const resolution: DependencyResolution = "asset_only";
        return {
          ...dep,
          resolution,
          agentAction: agentActionFor(resolution),
        };
      }

      const designSpecPath = resolveDesignSpecPath(opts.programme, dep.id);
      const libPath = resolveLibPath(opts.framework, opts.programme, dep.id);
      const [designSpecExists, libExists] = await Promise.all([
        Promise.resolve(opts.designSpecExists(designSpecPath)),
        Promise.resolve(opts.libExists(libPath)),
      ]);

      let resolution: DependencyResolution;
      if (libExists) {
        resolution = "use_existing";
      } else if (dep.required) {
        resolution = "missing_ask_user";
      } else {
        resolution = "optional_missing";
      }

      return {
        ...dep,
        resolution,
        designSpecPath,
        designSpecExists,
        libPath,
        libExists,
        agentAction: agentActionFor(resolution),
      };
    }),
  );
}

export async function buildDependencyReport(
  markdown: string | string[],
  opts: {
    programme: string;
    framework: "react" | "angular";
    designSpecExists: (path: string) => boolean | Promise<boolean>;
    libExists: (path: string) => boolean | Promise<boolean>;
  },
): Promise<DependencyReport> {
  const markdowns = Array.isArray(markdown) ? markdown : [markdown];
  const { declarationSource, declared } =
    extractDeclaredDependenciesFromSpecs(markdowns);
  const resolved = await resolveDeclaredDependencies(declared, opts);
  const askUser = resolved.filter((r) => r.resolution === "missing_ask_user");
  return {
    declarationSource,
    declared,
    resolved,
    askUser,
    dependencyAction: askUser.length > 0 ? "ask_user" : "clear",
  };
}

export function formatDependencyReportMarkdown(report: DependencyReport): string {
  const lines: string[] = [
    "## Component dependencies (resolved)",
    "",
    `Declaration source: \`${report.declarationSource}\`.`,
    `Action: \`${report.dependencyAction}\`.`,
    "",
    "Policy: **spec-declared only** — assets ≠ automatic peer components. Do not invent undeclared peers.",
    "",
  ];

  if (report.resolved.length === 0) {
    lines.push("_No dependencies declared in the design-spec pack._", "");
    return lines.join("\n");
  }

  lines.push("| Kind | Id | Required | Resolution | Spec | Lib | Agent action |");
  lines.push("|---|---|---|---|---|---|---|");
  for (const r of report.resolved) {
    const spec =
      r.kind === "asset"
        ? r.assetPathTemplate ?? "—"
        : r.designSpecExists
          ? `yes (\`${r.designSpecPath}\`)`
          : r.designSpecPath
            ? `no (\`${r.designSpecPath}\`)`
            : "—";
    const lib =
      r.kind === "asset"
        ? "—"
        : r.libExists
          ? `yes (\`${r.libPath}\`)`
          : r.libPath
            ? `no (\`${r.libPath}\`)`
            : "—";
    lines.push(
      `| ${r.kind} | \`${r.id}\`${r.publicName ? ` (${r.publicName})` : ""} | ${r.required} | \`${r.resolution}\` | ${spec} | ${lib} | ${r.agentAction} |`,
    );
  }
  lines.push("");

  if (report.askUser.length > 0) {
    lines.push("### Ask user before codegen");
    for (const r of report.askUser) {
      lines.push(
        `- Required peer \`${r.id}\`${r.publicName ? ` (${r.publicName})` : ""} missing at \`${r.libPath}\`. ${r.agentAction}`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}
