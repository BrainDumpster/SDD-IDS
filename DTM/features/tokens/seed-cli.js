import { seedFromIdsThemeFile } from "./seed.js";

const catalog = seedFromIdsThemeFile();
process.stdout.write(`Seeded ${catalog.tokens.length} tokens into DTM/records/catalog.json\n`);
