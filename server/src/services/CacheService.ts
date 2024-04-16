interface CacheData<T> {
  data: T;
  lastUpdatedAt: Date;
}
class CacheService<T> {
  private cacheTable: Map<string, CacheData<T>>;
  private ttl: number;
  constructor(ttl: number = 3600) {
    this.cacheTable = new Map<string, CacheData<T>>();
    this.ttl = ttl * 1000;
  }
  get(key: string): T | undefined {
    const cacheData = this.cacheTable.get(key);
    const currentTimeStamp = Date.now();
    if (cacheData) {
      if ((cacheData.lastUpdatedAt.getTime() + this.ttl) >= currentTimeStamp) {
        return cacheData.data;
      }
      this.cacheTable.delete(key);
    }
  }
  set(key: string, value: T): void {
    const cacheData: CacheData<T> = {
      data: value,
      lastUpdatedAt: new Date(),
    };
    this.cacheTable.set(key, cacheData);
  }
}


export default CacheService