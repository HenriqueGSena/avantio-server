import api from './api';

export default class ApiService {

    public async getAllServicesCleaning(): Promise<any[]> {
        try {
            const response = await api.get('/bookings/checkout');
            return response.data;
        } catch (err) {
            console.error('Erro ao retornar a lista atraves da requisicao', err);
            throw err;
        }
    }
}