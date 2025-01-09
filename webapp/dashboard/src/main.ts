import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { translations } from "./i18n/en/global";
import App from "./App.vue";
import router from "./router";

const language = {
    translations: translations,
};

const i18n = createI18n({
    locale: 'translations',
    messages: language,
});

const app = createApp(App);
app.use(i18n);
app.use(router);
app.mount('#app');
