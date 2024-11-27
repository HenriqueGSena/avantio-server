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

        const bookingDetails = await this.getBookingsDetailsId();
    }

    @Cron('0 */15 * * * *')
    async checkBookings() {
        this.confirmedBookingIds = await this.getConfirmedBookings();
    }

    async getConfirmedBookings(): Promise<{ id: string }[]> {
        try {
            const today = new Date().toISOString().split('T')[0];
            // const threeDaysAgo = new Date;
            // threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            // const threeDaysAgoFormatted = threeDaysAgo.toISOString().split('T')[0];

            const response = await this.apiService.get('/bookings' ,{
                params: {
                    departureDate_from: today,
                    departureDate_to: today,
                    status: [
                        BookingStatus.CONFIRMED
                    ],
                },
            });
            
            const bookings = response.data.data;
            console.log(bookings);
            return bookings;
        } catch (e) {
            console.error('Erro ao retornar lista de ids das reservas', e);
            return [];
        }
    }

    private async getAccommodationCode(accommodationId:string): Promise<string | null> {
        try {
            const accommodationResponse = await this.apiService.get(`/accommodations/${accommodationId}`);
            return accommodationResponse.data.data.name || null;
        } catch (error) {
            console.error(`Erro ao buscar código da acomodação com ID ${accommodationId}:`, error);
            return null;
        }
    }

    async getBookingsDetailsId(): Promise<{ id: string; statusService: string | null; serviceDate: string | null; accommodationCode: string | null; }[]> {
        const today = new Date().toISOString().split('T')[0];

        try {
            const detailsBooking = await Promise.all(
                this.confirmedBookingIds.map(async (booking) => {
                    const response = await this.apiService.get(`/bookings/${booking.id}`);
                    const bookingData = response.data.data;

                    const extra = bookingData.extras?.find((extraItem: any) =>
                        extraItem.info?.category?.code === ExtrasCategory.CLEANING && 
                        new Date(extraItem.applicationDate).toISOString().split('T')[0] === today
                    );

                    if (extra) {
                        const accommodationCode = await this.getAccommodationCode(bookingData.accommodation.id);
                        return {
                            id: bookingData.id,
                            serviceDate: new Date(extra.applicationDate).toISOString().split('T')[0],
                            accommodationCode,
                            statusService: extra.info.category?.code || null,
                        };
                    }
                    return null;
                })
            );
            const filteredDetails = detailsBooking.filter((item) => item !== null);

            return filteredDetails as { id: string; statusService: string | null; serviceDate: string | null; accommodationCode: string | null; }[];
        } catch (error) {
            console.error('Erro ao buscar detalhes das reservas por ID:', error);
            return [];
        }
    }

}

