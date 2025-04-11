import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia'
import "@/assets/global.css";
import PrimeVue from 'primevue/config';
import ToastService from "primevue/toastservice";
// import 'primevue/resources/themes/lara-light-blue/theme.css'; // Theme
// import 'primevue/resources/primevue.min.css';
// import 'primeicons/primeicons.css';
// Import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Buat aplikasi Vue dan gunakan router
const app = createApp(App);
const pinia = createPinia()
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(pinia);
app.mount("#app");
