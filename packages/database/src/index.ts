import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema/index.js';

export * from './schema/index.js';
export * from './seed.js';

export const createDatabaseClient = (connectionString: string) => {
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
};

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;
