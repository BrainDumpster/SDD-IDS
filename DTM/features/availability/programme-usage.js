import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "../paths.js";
import { extractTokenNames } from "./spec-check.js";

const ORDER = ["ids", "synapse", "dap", "powerflex"];

let cache = null;

export function programmeFromPath(filePath) {
  const normalized = String(filePath).split(path.sep).join("/");
  if (normalized === "components/ids-theme.css" || normalized.startsWith("components/ids/")) return "ids";
  if (
    normalized === "components/synapse-theme.css" ||
    normalized === "storybook/src/synapse-theme.css" ||
    normalized.startsWith("components/synapse/")
  ) {
    return "synapse";
  }
  if (
    normalized === "components/dap-theme.css" ||
    normalized.startsWith("components/DAP/") ||
    normalized.startsWith("components/dap/")
  ) {
    return "dap";
  }
  if (normalized === "components/powerflex-theme.css" || normalized.startsWith("components/powerflex/")) return "powerflex";
  return null;
}

export function addProgrammeUsage(usage, programme, text) {
  if (!programme) return;
  for (const name of extractTokenNames(text)) {
    if (!usage.has(name)) usage.set(name, new Set());
    usage.get(name).add(programme);
  }
}

function walk(dir, files) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "storybook-static") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".md") || entry.name.endsWith(".css")) files.push(full);
  }
}

function usageFiles() {
  const files = [];
  walk(path.join(REPO_ROOT, "components"), files);
  const synapseStorybook = path.join(REPO_ROOT, "storybook", "src", "synapse-theme.css");
  if (fs.existsSync(synapseStorybook)) files.push(synapseStorybook);
  return files;
}

function usageStamp(files) {
  return files.map((file) => {
    const stat = fs.statSync(file);
    return `${file}:${stat.mtimeMs}:${stat.size}`;
  }).join("\n");
}

function buildUsage(files) {
  const usage = new Map();
  for (const file of files) {
    const programme = programmeFromPath(path.relative(REPO_ROOT, file));
    if (!programme) continue;
    addProgrammeUsage(usage, programme, fs.readFileSync(file, "utf8"));
  }
  return usage;
}

export function invalidateProgrammeUsage() {
  cache = null;
}

function currentUsage() {
  const files = usageFiles();
  const stamp = usageStamp(files);
  if (!cache || cache.stamp !== stamp) cache = { stamp, usage: buildUsage(files) };
  return cache.usage;
}

export function introducingProgramme(name) {
  const found = currentUsage().get(name);
  if (!found) return null;
  const programmes = ORDER.filter((programme) => programme !== "ids" && found.has(programme));
  return programmes.length === 1 ? programmes[0] : null;
}

export function programmeTags(token) {
  const tags = ["ids"];
  const introduced = token?.introducedBy;
  if (introduced && introduced !== "ids" && ORDER.includes(introduced)) tags.push(introduced);
  return tags;
}
