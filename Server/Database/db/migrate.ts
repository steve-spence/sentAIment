import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root project directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function runMigration() {
  // Check if DATABASE_URL is defined
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in environment variables');
    process.exit(1);
  }

  console.log('Running database migrations...');
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
  
  try {
    // Create a migrator connection (with higher timeout)
    const migrationClient = postgres(process.env.DATABASE_URL, { max: 1, idle_timeout: 10 });
    const db = drizzle(migrationClient);
    
    // Run the migrations
    await migrate(db, { migrationsFolder: path.resolve(__dirname, '../drizzle') });
    
    console.log('Migrations complete! Closing connection...');
    await migrationClient.end();
    console.log('Done!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 