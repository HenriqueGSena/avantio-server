import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigServiceApi } from '../../config/config.server';
import { createAxiosClient } from '../../config/config.factory';
import { MessagingDetails } from '../enums/interfaces/messagingDetails';

@Injectable()
export class MessagingService implements OnModuleInit {

    private readonly apiService;
    private listIdsMessaging: { id: string }[] = [];
    

    constructor(private readonly configService: ConfigServiceApi) {
        this.apiService = createAxiosClient(this.configService);
    }

    public async onModuleInit() {
        // this.listIdsMessaging = await this.getListThreadsMessages();
        // console.log("List of IDs:", this.listIdsMessaging);
    }

    public async getListThreadsMessages(): Promise<{ id: string }[]> {

        try {
            // const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

            const startOfMonth = new Date(new Date().getMonth() - 3);
            const today = new Date().toISOString().split('T')[0];

            // console.log('Data de sete dias:', startOfMonth);
            // console.log('Segue a data atual:', today);

            let url: string | null = '/threads';
            let firstRequest = true;
            const paginationSize = 10;
            this.listIdsMessaging = [];

            while (url) {
                const response = await this.apiService.get(url, {
                    params: firstRequest ? {
                        pagination_size: paginationSize,
                        booking_creationDate_from: startOfMonth,
                        booking_creationDate_to: today,
                    } : {},
                    timeout: 120000,
                });
                const data = response.data;

                this.listIdsMessaging = this.listIdsMessaging.concat(data.data);

                url = data._links?.next || null;
                firstRequest = false;
            }
            return this.listIdsMessaging
        } catch (e) {
            console.error('Error ao retornar lista de ids messaging', e);
            return [];
        }
    }

    private async findListChannelsById(channelId: string) {
        try {
            const channelResponse = await this.apiService.get(`/threads/${channelId}/channels`);
            const channelData = channelResponse.data.data;

            return channelData;
        } catch (err) {
            console.error(`Error na busca dos canais de conversas com ID ${channelId}:`, err);
            return;
        }
    }

    // public async findMessagingById(): Promise<MessagingDetails[]> {
    //     try {
    //         const detailsMessaging = await Promise.all(
    //             this.listIdsMessaging.map(async (item) => {
    //                 const response = await this.apiService.get(`/threads/${item.id}/messages`);
    //                 const messagingData = response.data.data;

    //                 const msm = messagingData.date;
    //                 if (msm) {
    //                     return {
    //                         id: messagingData.id,
    //                         threadId: messagingData.thread_id,
    //                         channel: messagingData.channel,
    //                         booking_Id: messagingData.booking_id,
    //                         notified_count: messagingData.notifiedAt,
    //                         send_count: messagingData.sendAt,
    //                         total_messages: messagingData.total_messages,
    //                         average_time: messagingData.average_time,
    //                         max_time: messagingData.max_time,
    //                         min_time: messagingData.min_time,
    //                         source: messagingData.source,
    //                         sync_status: messagingData.sync_status,
    //                         created_at: new Date(msm),
    //                     } as MessagingDetails;
    //                 }
    //                 return null;
    //             }
    //         );
            
    //         const filteredMessages = detailsMessaging.filter((item) => item !== null);
    //         return filteredMessages as MessagingDetails[];
    //     } catch (e) {
    //         console.error('Error no retorno nos detalhes das menssagens', e);
    //     }
    // }
}

