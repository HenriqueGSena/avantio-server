import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BookingStatus } from '../enums/bookingStatus';

@Injectable()
export class BookingsService implements OnModuleInit {
    private confirmedBookingIds: { id: string }[] = [];
    constructor(@Inject('API_SERVICE') private readonly apiService) { }

    async onModuleInit() {
        this.confirmedBookingIds = await this.getConfirmedBookings();
        // console.log('Ids das reservas confirmadas:', this.confirmedBookingIds);

        const bookingDetails = await this.getBookingsDetailsId();
        console.log('Detalhes das reservas confirmadas:', bookingDetails);
    }

    @Cron('0 */15 * * * *')
    async checkBookings() {
        this.confirmedBookingIds = await this.getConfirmedBookings();
    }

    async getConfirmedBookings(): Promise<{ id: string }[]> {
        try {
            const today = new Date().toISOString().split('T')[0];
            const threeDaysAgo = new Date;
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            const threeDaysAgoFormatted = threeDaysAgo.toISOString().split('T')[0];

            console.log('Data atual:', today);
            console.log('Data de três dias atrás:', threeDaysAgoFormatted);

            const response = await this.apiService.get('/bookings', {
                params: {
                    departureDate_from: threeDaysAgoFormatted,
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
                }));

            return filteredBookings;
        } catch (e) {
            console.error('Erro ao retornar lista de ids das reservas', e);
            return [];
        }
    }

    async getBookingsDetailsId(): Promise<{ id: string; statusService: string | null; serviceDate: string }[]> {
        // departure: string;
        try {
            const detailsBooking = await Promise.all(
                this.confirmedBookingIds.map(async (booking) => {
                    const response = await this.apiService.get(`/bookings/${booking.id}`);
                    const bookingData = response.data.data;

                    return {
                        id: bookingData.id,
                        // departure: bookingData.stayDates.departure,
                        serviceDate: bookingData.extras?.[0]?.applicationDate
                            ? new Date(bookingData.extras[0].applicationDate).toISOString().split('T')[0] : null,
                        statusService: bookingData.extras.length > 0 ? bookingData.extras[0].info.category.code : null,
                        /** TODO:
                         * Para que o statusService seja exibido ele deverá somente com seu status = "CLEANING";
                         */
                    };
                })
            );

            return detailsBooking;

        } catch (error) {
            console.error('Erro ao buscar detalhes das reservas por ID:', error);
            return [];
        }
    }

}

