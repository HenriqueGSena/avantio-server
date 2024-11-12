import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { BookingStatus } from '../enums/bookingStatus';

@Injectable()
export class BookingsService implements OnModuleInit {
    constructor(@Inject('API_SERVICE') private readonly apiService) { }

    async onModuleInit() {
        const bookingIds = await this.getConfirmedBookings();
        console.log('Ids das reservas confirmadas:', bookingIds);
    }

    async getConfirmedBookings(): Promise<{ id: string; departure: string }[]> {
        try {
            const today = new Date().toISOString().split('T')[0];
            console.log('Retornando a data atual:', today);

            const response = await this.apiService.get('/bookings', {
                params: {
                    departureDate_from: today,
                    departureDate_to: today,
                },
            });
            const bookings = response.data.data;

            const filteredBookings = bookings
                .filter((booking) => {
                    
                    return (
                        (   booking.status === BookingStatus.CONFIRMED ||
                            booking.status === BookingStatus.UNPAID ||
                            booking.status === BookingStatus.PAID
                        )
                    );
                })
                .map((booking) => ({
                    id: booking.id,
                    // departure: booking.stayDates.departure,
                }));

            return filteredBookings;
        } catch (error) {
            console.error('Erro ao retornar lista de ids das reservas', error);
            return [];
        }
    }
}

