import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';


@Injectable()
export class RedisService {
  constructor(
    private logger: Logger = new Logger(RedisService.name),
    @Inject(CACHE_MANAGER)
    private redisCache: Cache,
  ) { }

  async getObjectByKey(key: string): Promise<any> {
    return await this.redisCache.get(key);
  }

  async setObjectByKeyValue(key: string, value: any, ttl: number): Promise<any> {
    return await this.redisCache.set(key, value, {
      ttl: ttl,
    } as any);
  }

  async deleteObjectByKey(key: string): Promise<any> {
    if(this.redisCache.get(key)) {
      return await this.redisCache.del(key);
    }
  }
}
