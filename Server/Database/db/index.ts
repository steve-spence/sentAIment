import { drizzle } from 'drizzle-orm/postgres-js';
import dotenv from "dotenv";
import postgres from 'postgres';

dotenv.config({ path: ".env" });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');

export default function db() {
    const client = postgres(process.env.DATABASE_URL!);
    const db = drizzle(client);
    return db;
}