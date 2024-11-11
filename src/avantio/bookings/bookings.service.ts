import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { BookingStatus } from '../enums/bookingStatus';

@Injectable()
export class BookingsService implements OnModuleInit {

    constructor(@Inject('API_SERVICE') private readonly apiService) { }

    async onModuleInit() {
        const bookingIds = await this.getConfirmedBookings();
        console.log('Ids das reservas confirmadas:', bookingIds);
    }

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
            return filteredBookings.map((booking) => booking.id);
        } catch (er) {
            console.error('Erro ao retorna lista de ids das reservas', er);
        }
    }
}
