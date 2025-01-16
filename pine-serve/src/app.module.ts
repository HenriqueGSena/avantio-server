import { Module } from '@nestjs/common';
import { ApiModuleAvantio } from './avantio/api.module.avantio';
import { CacheConfigModule } from './cache/cache.module';

@Module({
  imports: [ApiModuleAvantio, CacheConfigModule]
})
export class AppModule {}
