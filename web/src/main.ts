import { createApp } from 'vue'
import './assets/index.css'
import App from './App.vue'
import router from './lib/router'

createApp(App).use(router).mount('#app')
