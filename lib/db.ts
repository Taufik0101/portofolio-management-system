import { Pool, QueryResult } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Using mock data instead.");
}

// Parse the DATABASE_URL to get SSL configuration
const parseDatabaseUrl = (url: string) => {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port, 10),
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace("/", ""),
    ssl: {
      rejectUnauthorized: false,
    },
  };
};

const config = DATABASE_URL ? parseDatabaseUrl(DATABASE_URL) : {};

const pool = new Pool(config);

export async function query(text: string, params?: any[]): Promise<QueryResult<any>> {
  if (!DATABASE_URL) {
    // Return empty array for mock data mode
    return { rows: [], rowCount: 0 } as QueryResult<any>;
  }
  
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Error executing query", { text, error });
    throw error;
  }
}

export async function getClient() {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const client = await pool.connect();
  return client;
}

export default pool;
