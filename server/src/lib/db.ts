import { Db, MongoClient } from 'mongodb';
import { env } from './env';

type MongoCache = { client: MongoClient; promise?: Promise<MongoClient> };

const globalForMongo = globalThis as typeof globalThis & { mongo?: MongoCache };

function mongo() {
  if (!globalForMongo.mongo) {
    const client = new MongoClient(env().MONGODB_URI);
    globalForMongo.mongo = { client };
  }
  return globalForMongo.mongo;
}

/** Provides the shared client to Better Auth without opening a second connection. */
export function mongoClient(): MongoClient {
  return mongo().client;
}

/** Provides the configured database for adapters that manage their own queries. */
export function authDatabase(): Db {
  return mongo().client.db(env().MONGODB_DB_NAME);
}

export async function db(): Promise<Db> {
  const cache = mongo();
  cache.promise ??= cache.client.connect();
  const client = await cache.promise;
  return client.db(env().MONGODB_DB_NAME);
}
