import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databaseFile = path.join(__dirname, "database.json");

export async function readDatabase() {
  const raw = await fs.readFile(databaseFile, "utf8");
  return JSON.parse(raw);
}

export async function writeDatabase(data) {
  await fs.writeFile(databaseFile, JSON.stringify(data, null, 2));
  return data;
}
