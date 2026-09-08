/** Storybook Docs / developer-usage path candidates (GHES). */

export type Framework = "react" | "angular";

function toPascalCase(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

/**
 * Filename / folder stems to try for a programme + component.
 * Always includes the programme slug and an `ids-` stem (IDS-fork / shared Docs).
 */
function buildUsageStems(programme: string, componentName: string): string[] {
  const programmeLower = programme.toLowerCase();
  const pascal = toPascalCase(componentName);
  const programmePascal = toPascalCase(programmeLower);
  const stems = new Set<string>([
    `${programmeLower}-${componentName}`,
    `ids-${componentName}`,
    // e.g. ids-AccordionDap-style files used by some programme overlays
    `ids-${pascal}${programmePascal}`,
    `ids-${componentName}${programmePascal}`,
  ]);

  if (programmeLower === "ids") {
    stems.delete(`ids-${pascal}Ids`);
    stems.delete(`ids-${componentName}Ids`);
  }

  return [...stems];
}

/**
 * Prefer `*.developer-usage.ts` / `.js` (Storybook Docs copy).
 * Paths are derived from the programme slug — no hardcoded programme allowlist.
 */
export function buildDeveloperUsageCandidatePaths(
  programme: string,
  componentName: string,
  framework: Framework,
): string[] {
  const programmeLower = programme.toLowerCase();
  const stems = buildUsageStems(programme, componentName);
  const pascal = toPascalCase(componentName);
  const candidates = new Set<string>();

  if (framework === "angular") {
    const exts = [".js", ".ts"] as const;
    for (const stem of stems) {
      for (const ext of exts) {
        candidates.add(
          `storybook-angular/src/components/${stem}/${stem}.developer-usage${ext}`,
        );
        candidates.add(
          `storybook-angular/src/components/${stem}/${componentName}.developer-usage${ext}`,
        );
      }
    }
    return [...candidates];
  }

  // React
  const exts = [".ts", ".js", ".tsx", ".jsx"] as const;
  for (const stem of stems) {
    for (const ext of exts) {
      candidates.add(`storybook/src/components/lib-generated/${stem}.developer-usage${ext}`);
      candidates.add(`storybook/src/components/${stem}.developer-usage${ext}`);
      // Nested by programme folder (e.g. storybook/src/components/dap/…)
      candidates.add(
        `storybook/src/components/${programmeLower}/${stem}.developer-usage${ext}`,
      );
      candidates.add(
        `storybook/src/components/${programmeLower}/ids-${componentName}.developer-usage${ext}`,
      );
    }
  }

  for (const ext of exts) {
    candidates.add(`storybook-generated/${programmeLower}/src/components/${pascal}.developer-usage${ext}`);
    candidates.add(`components/${programme}/${componentName}/${componentName}.developer-usage${ext}`);
  }

  return [...candidates];
}
