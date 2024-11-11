import { Controller, Get } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';

@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingService: BookingsService) { }
    
    @Get()
    async getAllBookings() {
        const confirmedBookings = await this.bookingService.getConfirmedBookings();
        return confirmedBookings;
    }
}
