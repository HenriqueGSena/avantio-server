import { Vue } from "vue-class-component";
import api from '../../server/api'

export default class Cleaning extends Vue {
    public services: any[] = [];

    mounted() {
        this.getAllServices();
    }
    
    public async getAllServices() {
        try {
            const response = await api.get('/bookings/checkout');
            this.services = response.data;
        } catch (err) {
            console.error('Erro ao retornar a lista atraves da requisicao', err);
        }
    }

    public formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        // Força a data a ser tratada como local, evitando fuso horário
        const adjustedDate = new Date(`${dateString}T00:00:00`);
        return adjustedDate.toLocaleDateString('pt-BR', options);
    }

}