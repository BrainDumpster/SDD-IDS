/**
 * design-sync IDS-only Storybook config.
 *
 * The main `.storybook/` config indexes IDS + DAP + Synapse. design-sync derives a
 * component's name from its story title's LAST segment, so `Components/Synapse/Button`
 * and `Components/IDS/Button` would collide onto one component. This config narrows the
 * index to the canonical IDS stories in `src/components/lib-generated/` — the ones that
 * import from `@ids/react/*` (i.e. `lib/react/ids/`), which is what the synced bundle ships.
 *
 * Everything else (vite aliases, decorators, staticDirs) is inherited from `../.storybook/main.ts`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

import base from "../.storybook/main";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const storybookPackageRoot = path.resolve(configDir, "..");
const libGenerated = path.join(storybookPackageRoot, "src/components/lib-generated");

const storyFiles = fs
  .readdirSync(libGenerated)
  .filter((f) => /\.stories\.tsx?$/.test(f))
  .map((f) => path.join(libGenerated, f))
  .sort();

const config: StorybookConfig = {
  ...base,
  stories: storyFiles,
};

export default config;
