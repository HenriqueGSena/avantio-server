import { Inject, Injectable } from "@nestjs/common";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class CacheService {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    public async setCache(key: string, value: any) {
        await this.cacheManager.set(key, value);
    }

    public async getCache(key: string) {
        return await this.cacheManager.get(key);
    }

}
