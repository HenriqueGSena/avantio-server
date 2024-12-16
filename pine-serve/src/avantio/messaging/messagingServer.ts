import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigServiceApi } from '../../config/config.server';
import { createAxiosClient } from '../../config/config.factory';

@Injectable()
export class MessagingService implements OnModuleInit {

    private readonly apiService;
    private listIdsMessaging: { id: string }[] = [];
    

    constructor(private readonly configService: ConfigServiceApi) {
        this.apiService = createAxiosClient(this.configService);
    }

    public async onModuleInit() {
        this.listIdsMessaging = await this.getListThreadsMessages();
        console.log("List of IDs:", this.listIdsMessaging);
    }

    public async getListThreadsMessages(): Promise<{ id: string }[]> {

        // todo: resolver erro 504 na requisição feita para criar a lista de id threads;

        try {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];
            const threeDaysAgo = new Date;
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 7);
            const threeDaysAgoFormat = threeDaysAgo.toISOString().split('T')[0];

            console.log('Data de sete dias:', startOfYear);
            console.log('Segue a data atual:', today);

            let url: string | null = '/threads';
            let firstRequest = true;
            const paginationSize = 10;
            this.listIdsMessaging = [];
            console.log('Inicializando a lista vazia', this.listIdsMessaging);

            while (url) {
                const response = await this.apiService.get(url, {
                    params: firstRequest ? {
                        pagination_size: paginationSize,
                        booking_creationDate_from: startOfYear,
                        booking_creationDate_to: today,
                    } : {},
                    timeout: 120000,
                });
                const data = response.data;
                console.log('Data retornada:', data);

                this.listIdsMessaging = this.listIdsMessaging.concat(data.data);

                url = data._links?.next || null;
                firstRequest = false;
            }
            console.log('Finalizando com os IDs retornados:', this.listIdsMessaging);
            return this.listIdsMessaging
        } catch (e) {
            console.error('Error ao retornar lista de ids messaging', e);
            return [];
        }
    }
}

