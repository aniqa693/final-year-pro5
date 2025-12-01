import type { Config } from "drizzle-kit";
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });    // 👈 explicitly load the local file

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;