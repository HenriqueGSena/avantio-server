import { Options, Vue } from "vue-class-component";
import Stats from "../cards/stats/Stats.vue";
import Board from "../cards/board/board.vue";

@Options({
    components: {
        Stats,
        Board,
    }
})
export default class Dashboard extends Vue {
    isMenuOpen = false;

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
};

