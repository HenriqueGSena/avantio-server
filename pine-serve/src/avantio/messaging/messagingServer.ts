import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigServiceApi } from '../../config/config.server';
import { createAxiosClient } from '../../config/config.factory';
import { MessagingDetails } from '../enums/interfaces/messagingDetails';
import { BodyMessage, ApiResponse } from '../enums/interfaces/requestMessages';
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
        console.log('Mensagens processadas:', messages);
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
            const maxIds = 15200;
            let totalIdsCollected = 0;

            this.listIdsMessaging = [];
            console.log('Inicializando a aplicação com a lista vazia:', this.listIdsMessaging);

            let pageCounter = 1;

            while (url && totalIdsCollected < maxIds) {
                console.log(`\nRequisição para o endpoint: ${url}`);
                const startRequestTime = Date.now();
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
                totalIdsCollected += ids.length;

                const endRequestTime = Date.now();
                const requestDuration = endRequestTime - startRequestTime;
                console.log(`Tempo de resposta para a página ${pageCounter}: ${requestDuration} ms`);


                console.log(`Quantidade de itens adicionados: ${ids.length}.`);
                console.log(`Total atual de itens na lista: ${this.listIdsMessaging.length}.`);
                console.log(`Quantidade de IDs retornados na página ${pageCounter}: ${ids.length}`);
                console.log(`IDs da página ${pageCounter}: ${JSON.stringify(ids)}`);
                console.log(`Total acumulado de itens na lista: ${this.listIdsMessaging.length}`);

                if (totalIdsCollected >= maxIds) {
                    console.log(`Limite de ${maxIds} IDs atingido. Interrompendo a execução.`);
                    break;
                }

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

    public async processListMessagesById() {
        try {
            for (const threadId of this.listIdsMessaging) {
                console.log(`\nProcessando mensagens para o thread ID: ${threadId}`);

                let url: string | null = `/threads/${threadId}/messages`;
                let firstRequest = true;
                const paginationSize = 50;

                while (url) {
                    const response = await this.apiService.get(url, {
                        params: firstRequest ? {
                            pagination_size: paginationSize,
                        } : {},
                        timeout: 300000,
                    });
                    const data = response.data;
                    const messages = data.data;

                    messages.forEach(message => {
                        console.log(`Message ID: ${message.metadata.bookingId}`);
                        console.log(`Content: ${message.content}`);
                        console.log(`Sender: ${message.sender.name}`);
                        console.log(`Sent at: ${message.sentAt}`);
                    });

                    url = data._links?.next || null;
                    firstRequest = false;

                    if (url) {
                        console.log('Pausando por 2 segundos antes da próxima página...');
                        await delay(2000);
                    }
                }
            }
            console.log('Finished processing message details.');
        } catch (e) {
            console.error('Error no retorno dos detalhes da mensagem', e);
            throw e;
        }
    }
    
}

