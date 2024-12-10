import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigServiceApi } from '../../config/config.server';
import { createAxiosClient } from '../../config/config.factory';
import { Cron } from '@nestjs/schedule';
import { BookingStatus } from '../enums/bookingStatus';
import { ExtrasCategory } from '../enums/extrasCategory';

@Injectable()
export class BookingsService implements OnModuleInit {
    
    private readonly apiService;
    private confirmedBookingIds: { id: string }[] = [];

    constructor(private readonly configService: ConfigServiceApi) {
        this.apiService = createAxiosClient(this.configService)
    }

    async onModuleInit() {
        this.confirmedBookingIds = await this.getConfirmedBookings();

        const bookingDetails = await this.getBookingsDetailsId();
    }

    // @Cron('0 */15 * * * *')
    // async checkBookings() {
    //     this.confirmedBookingIds = await this.getConfirmedBookings();
    // }

    async getConfirmedBookings(): Promise<{ id: string }[]> {
        try {
            const today = new Date().toISOString().split('T')[0];

            const threeDaysAgo = new Date;
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            const threeDaysAgoFormatted = threeDaysAgo.toISOString().split('T')[0];

            let url: string | null = '/bookings';
            let firstRequest = true;

            while (url) {
                const response = await this.apiService.get( url, {
                    params: firstRequest ? {
                        pagination_size: 50,
                        departureDate_from: threeDaysAgoFormatted,
                        departureDate_to: today,
                        status: [
                            BookingStatus.CONFIRMED
                        ]
                    }: {},
                });

                const data = response.data;
                this.confirmedBookingIds = this.confirmedBookingIds.concat(data.data);

                url = data._links.next || null;
                firstRequest = false;
            }
            return this.confirmedBookingIds
        } catch (e) {
            console.error('Erro ao retornar lista de ids das reservas:', e);
            return [];
        }
    }

    private async getAccommodationDetails(accommodationId: string): Promise<{ name: string | null}> {
        try {
            const accResponse = await this.apiService.get(`/accommodations/${accommodationId}`);
            const accData = accResponse.data.data;
            
            return accData;
        } catch (error) {
            console.error(`Erro ao buscar código da acomodação com ID ${accommodationId}:`, error);
            return;
        }
    }

    async getBookingsDetailsId(): Promise<{ id: string; statusService: string | null; serviceDate: string | null; accCode: string | null; }[]> {
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
                        const accDetails = await this.getAccommodationDetails(bookingData.accommodation.id);
                        return {
                            id: bookingData.id,
                            serviceDate: new Date(extra.applicationDate).toISOString().split('T')[0],
                            accCode: accDetails.name,
                            statusService: extra.info.category?.code || null,
                        };
                    }
                    return null;
                })
            );
            const filteredDetails = detailsBooking.filter((item) => item !== null);

            return filteredDetails as { id: string; statusService: string | null; serviceDate: string | null; accCode: string | null; }[];
        } catch (error) {
            console.error('Erro ao buscar detalhes das reservas por ID:', error);
            return [];
        }
    }

}

