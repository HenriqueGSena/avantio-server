import { Controller, Get } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';

@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingService: BookingsService) { }
    
    @Get('checkout')
    public async getBookingsDetails() {
        try {
            const bookingsDetails = await this.bookingService.getBookingsDetailsId();
            return bookingsDetails;
        } catch (e) {
            console.error('Erro ao fazer a requisicao de bookings', e);
            throw e;
        }
    }
}
