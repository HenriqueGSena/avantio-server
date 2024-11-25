import { Options, Vue } from "vue-class-component";
import Dashboard from "./dashboard/dashboard.vue";

@Options({
    components: {
        Dashboard,
    },
})
export default class Painel extends Vue { }