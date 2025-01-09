import { Options, Vue } from "vue-class-component";
import Dashboard from "./dashboard/dashboard.vue";
import Cleaning from "./table/Cleaning.vue";

@Options({
    components: {
        Dashboard,
        Cleaning,
    },
})
export default class Painel extends Vue { }