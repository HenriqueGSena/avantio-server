import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BookingStatus } from '../enums/bookingStatus';
import { ExtrasCategory } from '../enums/extrasCategory';

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

    async getBookingsDetailsId(): Promise<{ id: string; statusService: string | null; serviceDate: string | null; referenceService: string  }[]> {
        const today = new Date().toISOString().split('T')[0];

        try {
            const detailsBooking = await Promise.all(
                this.confirmedBookingIds.map(async (booking) => {
                    const response = await this.apiService.get(`/bookings/${booking.id}`);
                    const bookingData = response.data.data;

                    const extra = bookingData.extras?.find(
                        (extraItem: any) =>
                            (extraItem.info?.category?.code === ExtrasCategory.CLEANING ||
                                extraItem.info?.reference === ExtrasCategory.CLEANING_REFERENCE) &&
                            new Date(extraItem.applicationDate).toISOString().split('T')[0] === today
                    );

                    if (extra) {
                        return {
                            id: bookingData.id,
                            serviceDate: new Date(extra.applicationDate).toISOString().split('T')[0],
                            statusService: extra.info.category?.code || null,
                            referenceService: extra.info.reference,
                        };
                    }

                    return null;
                })
            );
            return detailsBooking.filter((item) => item !== null) as { id: string; statusService: string | null; serviceDate: string | null; referenceService: string  }[];
        } catch (error) {
            console.error('Erro ao buscar detalhes das reservas por ID:', error);
            return [];
        }
    }


}

