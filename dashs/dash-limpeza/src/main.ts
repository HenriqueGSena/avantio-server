import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { optionsLanguages } from './i18n/en/global';
import App from './App.vue';

const languages = {
    optionsLanguages: optionsLanguages,
};

const i18n = createI18n({
    locale: 'optionsLanguages',
    messages: languages
});

const app = createApp(App);
app.use(i18n);
app.mount('#app');
