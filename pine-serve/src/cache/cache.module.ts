import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './nestCache/cache.service';

@Module({
    imports: [
        CacheModule.register(),
    ],
    providers: [CacheService],
})
export class CacheConfigModule {}
