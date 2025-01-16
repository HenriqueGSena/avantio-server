import { Options, Vue } from "vue-class-component";
import { useRouter } from "vue-router";
import Stats from "../cards/stats/Stats.vue";
import Board from "../cards/board/board.vue";

@Options({
    components: {
        Stats,
        Board,
    }
})
export default class Dashboard extends Vue {
    
    public isMenuOpen = false;
    public router = useRouter();

    public toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    public logout = () => {
        localStorage.removeItem('isAuthenticated');
        this.router.push('/');
    }
};

