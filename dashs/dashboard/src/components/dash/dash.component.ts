import { Options, Vue } from "vue-class-component";

export default class dash extends Vue {
    isMenuOpen = false;

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
};

