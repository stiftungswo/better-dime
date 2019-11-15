import {action, observable} from 'mobx';

/**
 * This class implements a cache which can be used to avoid having to fetch data from the DB
 */
export class Cache {

  private name: string;
  private readonly lines: number | null = null;
  private cache: any[] = []; // a simple cache for for fetchAll results with a single cache line

  constructor(lines: number | null = null, name: string = 'defaultCache') {
    this.lines = lines;
    this.name = name;
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
      return this.cache.map((o: any) => o.item);
    } else {
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
      // update LRU timestamp
      cacheResult.timestamp = Date.now();
      return cacheResult.item;
    } else {
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
