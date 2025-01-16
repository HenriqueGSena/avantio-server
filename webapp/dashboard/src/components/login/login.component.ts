import { Vue } from "vue-class-component";
import { useRouter } from "vue-router";

export default class Login extends Vue {

    public username: string = "";
    public password: string = "";
    public router = useRouter();

    public login() {
        if (this.username === 'admin' && this.password === 'admin') {
            localStorage.setItem('isAuthenticated', 'true');
            this.router.push('/home');
        } else {
            alert('Usuário ou senha inválidos.');
        }
    }
}