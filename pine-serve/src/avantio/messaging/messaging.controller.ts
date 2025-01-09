import { Controller, Get } from "@nestjs/common";
import { MessagingService } from "./messaging.service";

@Controller('messaging')
export class MessagingController {

    constructor(private readonly messagingService: MessagingService) { }

    @Get('threads')
    public async getListThreads() {
        try {
            const threadId = await this.messagingService.getListThreadsMessages();
            return threadId;
        } catch (e) {
            console.error('Erro no retorno da lista de ids', e);
            throw e;
        }
    }
}

