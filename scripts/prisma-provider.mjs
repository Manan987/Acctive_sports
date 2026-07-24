// Auto-selects the Prisma datasource provider from DATABASE_URL so the SAME
// codebase runs on SQLite locally and PostgreSQL in production (Vercel) with no
// manual schema edits.
//   file:./dev.db          -> sqlite
//   postgres(ql)://...     -> postgresql
//   mysql://...            -> mysql
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const schemaPath = join(root, "prisma", "schema.prisma");

function readDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  // Fallback: parse .env for local runs where the var isn't exported
  const envPath = join(root, ".env");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\n]+)["']?/);
      if (m) return m[1];
    }
  }
  return "";
}

const url = readDatabaseUrl();
let provider = "sqlite";
if (/^postgres(ql)?:\/\//i.test(url)) provider = "postgresql";
else if (/^mysql:\/\//i.test(url)) provider = "mysql";
else if (/^file:/i.test(url) || url === "") provider = "sqlite";

const schema = readFileSync(schemaPath, "utf8");
// Only touch the datasource provider (values sqlite|postgresql|mysql);
// the generator's "prisma-client-js" is left untouched.
const updated = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql|mysql)"/,
  `provider = "${provider}"`
);

if (updated !== schema) {
  writeFileSync(schemaPath, updated);
  console.log(`[prisma-provider] datasource provider -> ${provider}`);
} else {
  console.log(`[prisma-provider] datasource provider already ${provider}`);
}
