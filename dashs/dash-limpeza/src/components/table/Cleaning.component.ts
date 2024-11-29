import { Vue } from "vue-class-component";
import { StatusService } from "@/interface/statusService";
import ApiService from "@/service/service";

export default class Cleaning extends Vue {
    public services: any[] = [];
    public currentPage: number = 1;
    public itemsPerPage: number = 6;
    private intervalId: number | null = null;
    private apiService: ApiService = new ApiService();

    mounted() {
        this.loadServices();
        this.startAutoPagination();
    }

    beforeDestroy() {
        this.stopAutoPagination();
    }

    public async loadServices() {
        try {
            this.services = await this.apiService.getAllServicesCleaning();
            console.log('Serviços carregados:', this.services);
        } catch (err) {
            console.error("Erro ao carregar serviços", err);
        }
    }

    public startAutoPagination() {
        this.intervalId = setInterval(() => {
            this.nextPage();
        }, 10000);
    }

    public stopAutoPagination() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    public nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        } else {
            this.currentPage = 1;
        }
    }

    public get paginatedServices() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.services.slice(startIndex, endIndex);
    }

    public get totalPages() {
        return Math.ceil(this.services.length / this.itemsPerPage);
    }

    public formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        };
        const adjustedDate = new Date(`${dateString}T00:00:00`);
        return adjustedDate.toLocaleDateString("pt-BR", options);
    }

    public translateService(service: string): string {
        return StatusService[service as keyof typeof StatusService] || service;
    }
}
