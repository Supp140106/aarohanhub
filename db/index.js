import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

// Singleton pattern to prevent creating new connections on every hot-reload
const globalForDb = globalThis;

if (!globalForDb.__db_client) {
    globalForDb.__db_client = postgres(process.env.DATABASE_URL, {
        prepare: false,
        max: 5,          // Limit connection pool size
        idle_timeout: 20, // Close idle connections after 20s
    });
}

export const db = drizzle(globalForDb.__db_client, { schema });
