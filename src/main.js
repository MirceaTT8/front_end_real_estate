import './assets/main.css'

import { createApp } from 'vue'
import { createPinia} from "pinia";
import App from './App.vue'
import router from "@/router/index.js";
import PrimeVue from 'primevue/config'
import "./assets/main.css";
import {ConfirmDialog, ToastService} from "primevue";
const app = createApp(App)

const store = createPinia()

app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.component('ConfirmDialog', ConfirmDialog)
app.use(store)
app.mount('#app')
