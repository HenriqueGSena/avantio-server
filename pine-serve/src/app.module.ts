import { Module } from '@nestjs/common';
import { ApiModuleAvantio } from './avantio/api.module.avantio';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ApiModuleAvantio,
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
