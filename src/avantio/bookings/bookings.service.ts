import { Injectable, Inject } from '@nestjs/common';
import { BookingStatus } from '../types/bookingStatus';

@Injectable()
export class BookingsService {

    constructor(@Inject('API_SERVICE') private readonly apiService) { }

    async getConfirmedBookings(): Promise<any> {
        try {
            const response = await this.apiService.get('/bookings');
            const bookings = response.data.data;

            const confirmedBookings = bookings.filter(
                (booking) => booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.UNPAID,
            );
            return confirmedBookings;
        } catch (er) {
            console.error('Erro ao retorna lista de reservas', er);
        }
    }
}
