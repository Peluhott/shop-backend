import { getRedisClient } from "./redis";

const DEFAULT_TTL_SECONDS = 300;

function serializeCacheValue(value: unknown) {
  return JSON.stringify(value);
}

function deserializeCacheValue<T>(value: string) {
  return JSON.parse(value) as T;
}

export async function getOrSetCache<T>(
  key: string,
  load: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
) {
  const client = await getRedisClient();
  if (!client) {
    return load();
  }

  try {
    const cachedValue = await client.get(key);
    if (cachedValue !== null) {
      return deserializeCacheValue<T>(cachedValue);
    }
  } catch (error) {
    console.error(`Failed to read Redis cache for key ${key}`, error);
    return load();
  }

  const freshValue = await load();

  try {
    await client.set(key, serializeCacheValue(freshValue), { EX: ttlSeconds });
  } catch (error) {
    console.error(`Failed to write Redis cache for key ${key}`, error);
  }

  return freshValue;
}

export async function invalidateCachePrefixes(prefixes: string[]) {
  const client = await getRedisClient();
  if (!client || prefixes.length === 0) {
    return;
  }

  try {
    const keysToDelete = new Set<string>();

    for (const prefix of prefixes) {
      for await (const keys of client.scanIterator({
        MATCH: `${prefix}*`,
        COUNT: 100,
      })) {
        for (const key of keys) {
          keysToDelete.add(key);
        }
      }
    }

    if (keysToDelete.size > 0) {
      const keys = [...keysToDelete];

      if (keys.length === 1) {
        await client.del(keys[0]);
      } else {
        await client.del(keys as [string, ...string[]]);
      }
    }
  } catch (error) {
    console.error("Failed to invalidate Redis cache", error);
  }
}

export const cachePrefixes = {
  customerProducts: "cache:customer:products:",
  adminProducts: "cache:admin:products:",
  adminOrders: "cache:admin:orders:",
  adminCustomers: "cache:admin:customers:",
};
