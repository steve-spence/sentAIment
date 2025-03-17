import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

// Create a Postgres client
const client = postgres(process.env.DATABASE_URL);

// Create a Drizzle instance
export default function db() {
    return drizzle(client, { schema });
}

export { schema };