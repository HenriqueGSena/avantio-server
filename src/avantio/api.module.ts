import { Module } from '@nestjs/common';
import { ConfigServiceApi } from './config.server';
import axios from 'axios';
import { BookingsController } from './bookings/bookings.controller';

@Module({
  controllers: [BookingsController],
  providers: [
    ConfigServiceApi,
    {
      provide: 'API_SERVICE',
      useFactory: (configService: ConfigServiceApi) => {
        return axios.create({
          baseURL: configService.apiUrl,
          headers: {
            'X-Avantio-Auth': configService.apiKey
          },
        });
      },
      inject: [ConfigServiceApi],
    },
  ],
  exports: ['API_SERVICE'],
})
export class ApiModule {}
