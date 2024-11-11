import { Injectable, Inject } from '@nestjs/common';
import { BookingStatus } from '../enum/bookingStatus';

@Injectable()
export class BookingsService {

    constructor(@Inject('API_SERVICE') private readonly apiService) { }

    async getConfirmedBookings(): Promise<string[]> {
        try {
            const response = await this.apiService.get('/bookings');
            const bookings = response.data.data;

            const filteredBookings = bookings.filter(
                (booking) =>
                    booking.status === BookingStatus.CONFIRMED ||
                    booking.status === BookingStatus.UNPAID ||
                    booking.status === BookingStatus.PAID,
            );
            const bookingIds = filteredBookings.map((booking) => booking.id);
            return bookingIds;
        } catch (er) {
            console.error('Erro ao retorna lista de ids das reservas', er);
        }
    }
}
