import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000"; // Assuming the Express.js server is running on this URL

const app = createApp(App);
app.config.globalProperties.axios = axios;

app.mount("#app");
