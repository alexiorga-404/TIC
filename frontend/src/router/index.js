import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
        {
            path: '/',
            name: 'Home',
            component: () => import('../components/Home.vue'),
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../components/Login.vue'),

        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('../components/Register.vue'),
        },
       
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    if(!authStore.user && !from.name){
        await authStore.init()
    }

    if (authStore.user && (to.name === 'Login' || to.name === 'Register')) {
		next('/')
	}else if(!useAuthStore().user && (to.name === 'Cart' || to.path === '/cart')){
        next('/login')
    }
     else {
		next()
	}

})

export default router