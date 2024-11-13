import { Controller, Get } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';

@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingService: BookingsService) { }
    
    @Get('checkout')
    async getBookingsDetails() {
        const bookingsDetails = await this.bookingService.getBookingsDetailsId();
        return bookingsDetails;
    }
}
