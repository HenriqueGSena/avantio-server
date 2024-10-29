import { Controller, Get, Inject } from '@nestjs/common';

@Controller('bookings')
export class BookingsController {

    constructor(@Inject('API_SERVICE') private readonly apiService) { }
    
    @Get()
    async getAllBookings() { 
        const response = await this.apiService.get('/bookings');
        return response.data;
    }
}
