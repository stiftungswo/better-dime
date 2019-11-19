import {action, observable} from 'mobx';

/**
 * This class implements a cache which can be used to avoid having to fetch data from the DB
 */
export class Cache {

  static invalidateAllActiveCaches() {
    for (const cacheManager of Cache.activeCaches) {
      cacheManager.invalidate();
    }
  }

  private static activeCaches = [] as Cache[];

  private name: string;
  private readonly lines: number | null = null;
  private cache: any[] = [];
  private showDebugLogs: boolean = false;

  constructor(lines: number | null = null, name: string = 'defaultCache') {
    this.lines = lines;
    this.name = name;
    Cache.activeCaches.push(this);
  }

  /**
   * Invalidate all cache lines
   */
  invalidate() {
    this.cache.length = 0;
  }

  /**
   * Fetch all cache contents
   */
  fetchAll() {
    if (this.cache.length > 0) {
      if (this.showDebugLogs) {
        // tslint:disable-next-line:no-console
        console.log('CacheHit:', this.name);
      }
      return this.cache.map((o: any) => o.item);
    } else {
      if (this.showDebugLogs) {
        // tslint:disable-next-line:no-console
        console.log('CacheMiss:', this.name);
      }
      return null;
    }
  }

  /**
   * fetch a specific cache item
   * @param id id of the item which was cached
   */
  fetchOne(id: number) {
    const cacheResult = this.cache.find((o: any) => o.item.id === id);

    if (cacheResult != null) {
      if (this.showDebugLogs) {
        // tslint:disable-next-line:no-console
        console.log('CacheHit:', this.name);
      }
      // update LRU timestamp
      cacheResult.timestamp = Date.now();
      return cacheResult.item;
    } else {
      if (this.showDebugLogs) {
        // tslint:disable-next-line:no-console
        console.log('CacheMiss:', this.name);
      }
      return null;
    }
  }

  /**
   * put an item into the cache
   * @param item item to put in the cache
   */
  put(item: any) {
    this.cache.push({timestamp: Date.now(), item});

    if (this.lines != null && this.cache.length > this.lines) {
      const sortedCache = this.cache.sort((a: any, b: any) => b.timestamp - a.timestamp);
      const evicted = sortedCache.pop();
      this.cache = sortedCache;
    }
  }
}
