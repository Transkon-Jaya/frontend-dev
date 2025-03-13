import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Import Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Buat aplikasi Vue dan gunakan router
const app = createApp(App);
app.use(router);
app.mount("#app");
