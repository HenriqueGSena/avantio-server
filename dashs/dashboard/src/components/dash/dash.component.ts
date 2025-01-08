import { Options, Vue } from "vue-class-component";
import Stats from "../cards/stats/Stats.vue";

@Options({
    components: {
        Stats,
    }
})
export default class Dashboard extends Vue {
    isMenuOpen = false;

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
};

