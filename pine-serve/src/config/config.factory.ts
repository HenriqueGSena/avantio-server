import axios, { AxiosInstance } from 'axios';
import { ConfigServiceApi } from './config.server';

export const createAxiosClient = (configService: ConfigServiceApi): AxiosInstance => {
    return axios.create({
        baseURL: configService.apiUrl,
        // timeout: 60000,
        headers: {
            'X-Avantio-Auth': configService.apiKey,
        },
    });
};

