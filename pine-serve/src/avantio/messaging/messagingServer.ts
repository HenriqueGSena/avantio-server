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
        this.listIdsMessaging = await this.getListThreadsMessages();
        console.log("IDs retornados dentro da lista:", this.listIdsMessaging);
    }

    public async getListThreadsMessages(): Promise<{ id: string }[]> {
        try {
            // const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

            const startOfMonth = new Date(new Date().getMonth() - 1);

            const today = new Date().toISOString().split('T')[0];

            console.log('Um tres dias atrás:', startOfMonth);
            console.log('Data Atual:', today);

            let threadsById: string | null = '/threads';
            let firstRequest = true;
            const paginationSize = 30;

            this.listIdsMessaging = [];
            console.log('Inicializando a aplicação com a lista vazia:', this.listIdsMessaging);

            while (threadsById) {
                console.log(`Iniciando a requisição para o endpoint: ${threadsById}`);
                const response = await this.apiService.get(threadsById, {
                    params: firstRequest
                        ? {
                            pagination_size: paginationSize,
                            booking_creationDate_from: startOfMonth,
                            booking_creationDate_to: today,
                        }
                        : {},
                    timeout: 30000,
                });

                const data = response.data;

                // console.log('Dados retornados pela requisição:', JSON.stringify(data, null, 2));

                const previousLength = this.listIdsMessaging.length;
                this.listIdsMessaging = this.listIdsMessaging.concat(data.data);

                console.log(
                    `Quantidade de itens adicionados: ${this.listIdsMessaging.length - previousLength}.`
                );
                console.log(
                    `Total atual de itens na lista: ${this.listIdsMessaging.length}.`
                );

                threadsById = data._links?.next || null;
                firstRequest = false;
            }

            console.log('Lista final de IDs retornada:', JSON.stringify(this.listIdsMessaging, null, 2));
            return this.listIdsMessaging;
        } catch (e) {
            console.error('Erro ao retornar lista de IDs messaging:', e);
            return [];
        }
    }

    private async findListChannelsById(channelId: string) {
        try {
            const channelResponse = await this.apiService.get(`/threads/${channelId}/channels`);
            const channels = channelResponse.data.data;

            return channels;
        } catch (err) {
            console.error(`Error na busca dos canais de conversas com ID: ${channelId}:`, err);
            return;
        }
    }

    public async getMessagingDetails(): Promise<MessagingDetails[]> {
        const results: MessagingDetails[] = [];

        for (const { id: threadId } of this.listIdsMessaging) {
            console.log('IDs sendo usados:',this.listIdsMessaging);
            try {
                const messages = await this.getListMessaging(threadId);
                if (messages.length > 0) {
                    messages.sort((a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime());

                    const { average, max, min } = this.calculateTimeStats(messages);
                    const bookingId = this.getFirstBookingId(messages);
                    console.log(`Retorno do bookingId ${bookingId}`);
                    const channels = await this.findListChannelsById(threadId);
                    console.log(`Retorno dos canais: ${channels}`);
                    
                    results.push({
                        threadId: threadId,
                        channel: channels,
                        booking_Id: bookingId,
                        notified_count: `${messages.filter((msg) => msg.notified).length}`,
                        send_count: `${messages.filter((msg) => msg.sendAt).length}`,
                        total_messages: `${messages.length}`,
                        average_time: average,
                        max_time: max,
                        min_time: min,
                        source: messages[0].source || '',
                        sync_status: messages[0].syncStatus || '',
                        created_at: new Date(messages[0].createdAt),
                    });
                }
            } catch (err) {
                console.error(`Error no processamento da thread: ${threadId}`, err);
                throw err;
            }
        }
        console.log('Retorno dos campos', results);
        return results;
    }

    private getFirstBookingId(messages: any[]): string | null {
        for (const message of messages) {
            if (message.metadata?.bookingId) {
                return message.metadata.bookingId;
            }
        }
        return null;
    }

    private async getListMessaging(id: string): Promise<any[]> {
        const paginationSize = 30;
        let firstRequest = true;
        let IdThread: string | null = `/threads/${id}/messages`;
        const allMessages = [];

        try {
            while (IdThread) {
                const response = await this.apiService.get(IdThread, {
                    params: firstRequest ? { pagination_size: paginationSize }: {},
                });
                const data = response.data;

                allMessages.push(...data.data);
                IdThread = data._links?.next || null;
                firstRequest = false;
            }
        } catch (e) {
            console.error(`Error ao buscar mensagens para ${IdThread}:`, e);
            throw Error(e);
        }

        return allMessages;
    }

    private calculateTimeStats(messages: any[]): { average: number; max: number; min: number } {
        const times: number[] = [];

        for (let i = 1; i < messages.length; i++) {
            const prevSendAt = new Date(messages[i - 1].sendAt).getTime();
            const currSendAt = new Date(messages[i].sendAt).getTime();
            const interval = (currSendAt - prevSendAt) / 1000;
            times.push(interval);
        }
        const total = times.reduce((acc, time) => acc + time, 0);

        return {
            average: times.length > 0 ? total / times.length : 0,
            max: times.length > 0 ? Math.max(...times) : 0,
            min: times.length > 0 ? Math.min(...times) : 0,
        };
    }

}

