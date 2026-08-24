const fs = require("node:fs");
const path = require("node:path");

const packageRoot = path.resolve(__dirname, "..");
const compiledComponentRoots = [
  path.join(packageRoot, "compiled/storybook-angular/src/components"),
  path.join(packageRoot, "compiled/lib/angular/ids"),
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.name.endsWith(".js")) {
      files.push(full);
    }
  }
  return files;
}

for (const compiledComponentsRoot of compiledComponentRoots) {
  if (!fs.existsSync(compiledComponentsRoot)) {
    continue;
  }

  for (const file of walk(compiledComponentsRoot)) {
    const relToContracts = path
      .relative(path.dirname(file), path.join(packageRoot, "compiled/component-contracts"))
      .split(path.sep)
      .join("/");

    let source = fs.readFileSync(file, "utf8");
    const next = source.replace(
      /from "@component-contracts\/([^"]+)"/g,
      `from "${relToContracts}/$1.js"`,
    );
    if (next !== source) {
      fs.writeFileSync(file, next);
    }
  }
}
