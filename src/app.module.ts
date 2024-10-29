import { Module } from '@nestjs/common';
import { ApiModule } from './avantio/api.module';

@Module({
  imports: [ApiModule]
})
export class AppModule {}
