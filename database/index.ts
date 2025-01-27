import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
import * as schema from './schema';
export * from './types/index.d';

dotenv.config();

export const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

pool.connect()
  .then(() => console.log('Database connected successfully'))
  .catch((err: any) => console.error('Database connection error:', err));

export { schema };
export const db = drizzle(pool, { schema });
