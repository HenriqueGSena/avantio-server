import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigServiceApi } from '../../config/config.server';
import { createAxiosClient } from '../../config/config.factory';
import { BookingStatus } from '../enums/bookingStatus';

@Injectable()
export class MessagingService implements OnModuleInit {

    private readonly apiService;
    private listIdsMessaging: { id: string }[] = [];
    

    constructor(private readonly configService: ConfigServiceApi) {
        this.apiService = createAxiosClient(this.configService);
    }

    async onModuleInit() {
        this.listIdsMessaging = await this.getListThreadsMessages();
    }

    public async getListThreadsMessages(): Promise<{ id: string }[]> {
        try {
            let url: string | null = '/threads';
            const paginationSize = 100;

            const response = await this.apiService.get(url, {
                params: {
                    pagination_size: paginationSize,
                },
            });

            const data = response.data;
            this.listIdsMessaging = this.listIdsMessaging.concat(data.data);

            return this.listIdsMessaging
        } catch (e) {
            console.error('Error ao retornar lista de ids messaging', e);
            return [];
        }
    }
}

