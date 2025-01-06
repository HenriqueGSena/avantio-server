import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigServiceApi } from '../config/config.server';
import { BookingsController } from './bookings/bookings.controller';
import { BookingsService } from './bookings/bookings.service';
import { MessagingController } from './messaging/messagingController';
import { MessagingService } from './messaging/messagingServer';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [BookingsController, MessagingController],
  providers: [ConfigServiceApi, BookingsService, MessagingService],
})
export class ApiModuleAvantio {}
