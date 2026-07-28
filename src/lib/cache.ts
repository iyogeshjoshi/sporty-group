type Entry<T> = { value: T; expiresAt: number };

type CacheOptions = {
  ttlMs: number;
  persistKey?: string;
};

export type Cache = {
  fetchWithCache: <T>(key: string, loader: () => Promise<T>) => Promise<{ value: T; fromCache: boolean }>;
  invalidate: (key: string) => void;
  clear: () => void;
};

/**
 * Creates a new cache instance.
 * @param options Cache options.
 * @returns The cache instance.
 */
export function createCache({ ttlMs, persistKey }: CacheOptions): Cache {
  const store = new Map<string, Entry<unknown>>();
  const inFlight = new Map<string, Promise<unknown>>();

  if (persistKey) {
    hydrate(store, persistKey);
  }

  /**
   * Reads a value from the cache if it exists and hasn't expired.
   * @param key The key to read.
   * @returns The value if it exists and hasn't expired, otherwise undefined.
   */
  function readValid<T>(key: string): T | undefined {
    const entry = store.get(key) as Entry<T> | undefined;
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /**
   * Writes a value to the cache with an expiration time.
   * @param key The key to write.
   * @param value The value to write.
   * @returns void
   */
  function write<T>(key: string, value: T): void {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
    if (persistKey) persist(store, persistKey);
  }

  /**
   * Fetches a value from the cache or loads it using the provided loader function.
   * @param key The key to fetch.
   * @param loader A function that returns a promise to load the value if it's not in the cache.
   * @returns Promise
   */
  async function fetchWithCache<T>(key: string, loader: () => Promise<T>): Promise<{ value: T; fromCache: boolean }> {
    const cached = readValid<T>(key);
    if (cached !== undefined) {
      return { value: cached, fromCache: true };
    }

    const pending = inFlight.get(key) as Promise<T> | undefined;
    if (pending) {
      return { value: await pending, fromCache: true };
    }

    const promise = loader()
      .then((value) => {
        write(key, value);
        return value;
      })
      .finally(() => {
        inFlight.delete(key);
      });

    inFlight.set(key, promise);

    return { value: await promise, fromCache: false };
  }

  /**
   * Invalidates a specific cache entry.
   * @param key The key to invalidate.
   */
  function invalidate(key: string): void {
    store.delete(key);
    inFlight.delete(key);
    if (persistKey) persist(store, persistKey);
  }

  /**
   * Clears the entire cache.
   */
  function clear(): void {
    store.clear();
    inFlight.clear();
    if (persistKey) persist(store, persistKey);
  }

  return { fetchWithCache, invalidate, clear };
}

/**
 * Hydrates the cache from sessionStorage.
 * @param store Cache store to hydrate
 * @param persistKey Key used to persist the cache in sessionStorage
 * @returns void
 */
function hydrate(store: Map<string, Entry<unknown>>, persistKey: string): void {
  try {
    const raw = sessionStorage.getItem(persistKey);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, Entry<unknown>>;
    const now = Date.now();
    for (const [key, entry] of Object.entries(parsed)) {
      if (entry.expiresAt > now) {
        store.set(key, entry);
      }
    }
  } catch {
    console.warn(`Failed to hydrate cache from sessionStorage key "${persistKey}". Starting with empty cache.`);
  }
}

/**
 * Persists the cache to sessionStorage.
 * @param store The cache store.
 * @param persistKey The key to use for persistence.
 */
function persist(store: Map<string, Entry<unknown>>, persistKey: string): void {
  try {
    sessionStorage.setItem(persistKey, JSON.stringify(Object.fromEntries(store)));
  } catch {
    console.warn(`Failed to persist cache to sessionStorage key "${persistKey}".`);
  }
}

export const leaguesCache = createCache({ ttlMs: 5 * 60_000 });
export const badgeCache = createCache({
  ttlMs: 30 * 60_000,
  persistKey: "sportyLeagues.cache",
});
