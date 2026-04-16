import mysql from "mysql2/promise";
import { env } from "../config/env.js";

function getSslConfig() {
  if (!env.dbSslMode) {
    return undefined;
  }

  if (["required", "require", "preferred"].includes(env.dbSslMode)) {
    // Aiven and similar hosted MySQL services require TLS in production.
    return {
      rejectUnauthorized: false,
    };
  }

  return undefined;
}

export const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  ssl: getSslConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function verifyDatabaseConnection() {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}
