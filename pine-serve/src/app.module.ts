import { Module } from '@nestjs/common';
import { ApiModuleAvantio } from './avantio/api.module.avantio';

@Module({
  imports: [ApiModuleAvantio]
})
export class AppModule {}
