import "dotenv/config";

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.MYSQL_URL || "";
}

function getDatabaseConfigFromUrl(databaseUrl) {
  if (!databaseUrl) {
    return null;
  }

  try {
    const parsed = new URL(databaseUrl);
    const sslMode = parsed.searchParams.get("ssl-mode") || parsed.searchParams.get("sslmode");

    return {
      dbHost: parsed.hostname,
      dbPort: Number(parsed.port || 3306),
      dbUser: decodeURIComponent(parsed.username),
      dbPassword: decodeURIComponent(parsed.password),
      dbName: parsed.pathname.replace(/^\//, ""),
      dbSslMode: sslMode ? sslMode.toLowerCase() : "",
    };
  } catch {
    return null;
  }
}

const dbUrl = getDatabaseUrl();
const urlConfig = getDatabaseConfigFromUrl(dbUrl);

export const env = {
  port: Number(process.env.PORT || 5000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  dbUrl,
  dbHost:
    process.env.DB_HOST ||
    process.env.MYSQLHOST ||
    urlConfig?.dbHost ||
    "127.0.0.1",
  dbPort: Number(
    process.env.DB_PORT ||
      process.env.MYSQLPORT ||
      urlConfig?.dbPort ||
      3306,
  ),
  dbUser:
    process.env.DB_USER ||
    process.env.MYSQLUSER ||
    urlConfig?.dbUser ||
    "root",
  dbPassword:
    process.env.DB_PASSWORD ||
    process.env.MYSQLPASSWORD ||
    urlConfig?.dbPassword ||
    "",
  dbName:
    process.env.DB_NAME ||
    process.env.MYSQLDATABASE ||
    urlConfig?.dbName ||
    "optimized_retail_inventory",
  dbSslMode: (
    process.env.DB_SSL_MODE ||
    process.env.MYSQL_SSL_MODE ||
    urlConfig?.dbSslMode ||
    ""
  ).toLowerCase(),
};
