import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/style.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import App from '@/App.vue'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()

authStore.init().then(() => {
  app.mount('#app')
})

