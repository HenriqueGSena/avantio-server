import { Options, Vue } from 'vue-class-component';
import Painel from './components/Painel.vue';
import './styles/index.css';

@Options({
    components: {
        Painel,
    },
})
export default class App extends Vue { }