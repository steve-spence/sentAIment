import { drizzle } from 'drizzle-orm/postgres-js';
import dotenv from "dotenv";
import postgres from 'postgres';

dotenv.config({ path: ".env" });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');

const client = postgres(process.env.DATABASE_URL);

// logger
const db = drizzle(client, { logger: true });
//const db = drizzle(client);

export { db };
