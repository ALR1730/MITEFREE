import { Module, Global, Logger } from '@nestjs/common';
import { createDatabaseClient, type DatabaseClient } from '@mitefree/database';
import { DRIZZLE_DB } from './database.tokens.js';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DB,
      useFactory: (): DatabaseClient | null => {
        const logger = new Logger('DatabaseModule');
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
          logger.warn(
            'DATABASE_URL environment variable is not defined. Operating with in-memory persistence fallback.',
          );
          return null;
        }

        try {
          logger.log('Initializing Drizzle ORM client with Neon PostgreSQL connection.');
          return createDatabaseClient(connectionString);
        } catch (error) {
          logger.error('Failed to initialize Drizzle database client', error);
          return null;
        }
      },
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DatabaseModule {}
