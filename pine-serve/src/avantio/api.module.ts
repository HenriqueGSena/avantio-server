import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigServiceApi } from '../config/config.server';
import { BookingsController } from './bookings/bookings.controller';
import { BookingsService } from './bookings/bookings.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [BookingsController],
  providers: [ConfigServiceApi, BookingsService],
})
export class ApiModule {}
