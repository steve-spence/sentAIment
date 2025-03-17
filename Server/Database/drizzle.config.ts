import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.ts",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        // host: "aws-0-us-east-2.pooler.supabase.com",
        // port: 6543,
        // database: "investment-ai",
        // user: "postgres.ausydguaxrvhilspunoz",
        // password: process.env.SUPABASE_PASSWORD!,
        // ssl: "allow",
    },
    out: "./drizzle"
});