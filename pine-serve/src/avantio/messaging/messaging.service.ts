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

        // const messages = await this.processListMessagesById();
        // console.log('Mensagens processadas:', messages);
    }

    public async getListThreadsMessages(): Promise<{ id: string }[]> {
        try {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];

            console.log(`Periodo de busca da thread messages: ${startOfYear} + ${today}`);

            let url: string | null = '/threads';
            let firstRequest = true;
            const paginationSize = 100;

            while (url) {
                const response = await this.apiService.get(url, {
                    params: firstRequest ? {
                        pagination_size: paginationSize,
                        booking_creationDate_from: startOfYear,
                        booking_creationDate_to: today
                    } : {},
                });

                const ids = response.data.data.map(thread => thread.id);
                console.log(ids);

                url = response.data._links.next || null;
                console.log(url);
                firstRequest = false;
            }
            console.log('\n==> Lista final de IDs retornada:');
            console.log('Lista final de IDs retornada:', JSON.stringify(this.listIdsMessaging, null, 2));
            return this.listIdsMessaging;
        } catch(e) {
            console.error('Erro ao retornar lista de IDs messaging:', e.response?.data || e.message || e);
            return [];
        }
    }

    private async findListChannelsById(channelId: string): Promise< string | null > {
        try {
            const channelResponse = await this.apiService.get(`/threads/${channelId}/channels`);
            const channels = channelResponse.data.data;
            return channels;
        } catch (err) {
            console.error(`Error na busca dos canais de conversas com ID: ${channelId}:`, err);
            return null;
        }
    }

    public async processListMessagesById() {
        try {
            for (const threadId of this.listIdsMessaging) {
                console.log(`\nThreadId: ${threadId}`);
                
                let url: string | null = `/threads/${threadId}/messages`;
                let firstRequest = true;
                const paginationSize = 50;
                const sentAtTimes: number[] = [];

                while (url) {
                    const response = await this.apiService.get(url, {
                        params: firstRequest ? { pagination_size: paginationSize } : {},
                    });
                    const data = response.data;
                    const messages = data.data;

                    if (messages.length > 0) {
                        const bookingId = messages[0].metadata?.bookingId;
                        console.log(`\nbookingId: ${bookingId}`);

                        messages.forEach((message) => {
                            const sentAt = message.sentAt;
                            if (sentAt) {
                                const sentAtTimestamp = new Date(sentAt).getTime();
                                sentAtTimes.push(sentAtTimestamp);
                            }
                        });
                    }

                    url = data._links?.next || null;
                    firstRequest = false;
                }
                if (sentAtTimes.length > 0) {
                    this.calculateSentAtMetrics(sentAtTimes);
                }
            }
        } catch (e) {
            console.error('Error no retorno dos detalhes da mensagem', e);
            throw e;
        }
    }

    private calculateSentAtMetrics(sentAtTimes: number[]) {
        const minTime = Math.min(...sentAtTimes);
        const maxTime = Math.max(...sentAtTimes);
        const averageTime = sentAtTimes.reduce((sum, time) => sum + time, 0) / sentAtTimes.length;

        console.log(`Time_min (ms): ${minTime}`);
        console.log(`Time_max (ms): ${maxTime}`);
        console.log(`Avg_time (ms): ${averageTime}`);
    }

}

