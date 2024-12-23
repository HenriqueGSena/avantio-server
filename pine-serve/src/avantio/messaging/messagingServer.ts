import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigServiceApi } from '../../config/config.server';
import { createAxiosClient } from '../../config/config.factory';
import { MessagingDetails } from '../enums/interfaces/messagingDetails';
import { delay } from 'rxjs';

@Injectable()
export class MessagingService implements OnModuleInit {

    private readonly apiService;
    private listIdsMessaging: { id: string }[] = [];
    private failedIdsMessaging: { id: string, error: string }[] = [];
    

    constructor(private readonly configService: ConfigServiceApi) {
        this.apiService = createAxiosClient(this.configService);
    }

    public async onModuleInit() {
        this.listIdsMessaging = await this.getListThreadsMessages();

        const messages = await this.processListMessagesById();
    }

    public async getListThreadsMessages(): Promise<{ id: string }[]> {
        try {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
            const mounth = new Date("2024-12-20").toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];

            console.log('Um mes:', startOfYear);
            console.log('Data Atual:', today);

            let url: string | null = '/threads';
            let firstRequest = true;
            const paginationSize = 50;

            this.listIdsMessaging = [];
            console.log('Inicializando a aplicação com a lista vazia:', this.listIdsMessaging);

            let pageCounter = 1;

            while (url) {
                console.log(`\nRequisição para o endpoint: ${url}`);
                const response = await this.apiService.get(url, {
                    params: firstRequest ? {
                        pagination_size: paginationSize,
                        booking_creationDate_from: startOfYear,
                        booking_creationDate_to: today,
                    } : {},
                    timeout: 300000,
                });

                const ids = response.data.data.map(thread => thread.id);
                const previousLength = this.listIdsMessaging.length;
                this.listIdsMessaging.push(...ids);

                console.log(`Quantidade de itens adicionados: ${ids.length}.`);
                console.log(`Total atual de itens na lista: ${this.listIdsMessaging.length}.`);
                console.log(`Quantidade de IDs retornados na página ${pageCounter}: ${ids.length}`);
                console.log(`IDs da página ${pageCounter}: ${JSON.stringify(ids)}`);
                console.log(`Total acumulado de itens na lista: ${this.listIdsMessaging.length}`);

                url = response.data.links?.next || response.data._links?.next;
                console.log(`Próximo URL: ${url}`);
                firstRequest = false;
                pageCounter++;

                if (url) {
                    console.log('Pausando por 2 segundos antes da próxima requisição...');
                    await delay(2000);
                }
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

    public async processListMessagesById(): Promise<void> {
        for (const { id } of this.listIdsMessaging) {
            try {
                const details = this.searchMessageDetails(id);
                console.log('Detalhes do retorno da requisição:', details);
            } catch (e) {
                console.error(`Error na busca dos detalhes do seguinte ID: ${id}`, e);
                this.failedIdsMessaging.push({ id, error: e.message || e });
            }
        }
    }

    public async searchMessageDetails(id: string): Promise<any> {

        const paginationSize = 50;

        try {
            let firstRequest = true;

            console.log(`Buscando detalhes para o ID ${id}`);
            const response = await this.apiService.get(`/threads/${id}/messages`, {
                params: firstRequest ?{
                    pagination_size: paginationSize,
                } : {},
            });
            const messages = response.data;

            let notificationCount = 0;
            let messageCount = 0;

            const mappedData = await Promise.all(
                messages.map(async (message: any) => {
                    if (message.sender?.notifiedAt) {
                        notificationCount++;
                    }

                    if (message.sentAt) {
                        messageCount++;
                    }
                    const listChannel = await this.findListChannelsById(message.channel);
                    return {
                        channel: listChannel,
                        bookingId: message.metadata[0]?.bookingId,
                        sender: {
                            notifiedAt: message.sender?.notifiedAt,
                        },
                        sentAt: message.sentAt,
                        syncStatus: message.syncStatus,
                    }
                })
            )
            firstRequest = false;
            return {
                mappedData,
                notificationCount,
                messageCount,
            };
        } catch (e) {
            console.error('Error no retorno nos detalhes da mensagem:', e);
            throw e;
        }
    }

}

