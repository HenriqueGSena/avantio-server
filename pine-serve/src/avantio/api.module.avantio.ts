import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigServiceApi } from '../config/config.server';
import { BookingsController } from './bookings/bookings.controller';
import { BookingsService } from './bookings/bookings.service';
import { MessagingController } from './messaging/messaging.controller';
import { MessagingService } from './messaging/messaging.service';
import { PrismaService } from 'src/db/prisma.service';
import { CacheConfigModule } from '../cache/cache.module';

@Module({
  imports: [ScheduleModule.forRoot(), CacheConfigModule],
  controllers: [BookingsController, MessagingController],
  providers: [ConfigServiceApi, BookingsService, MessagingService],
})
export class ApiModuleAvantio { }
