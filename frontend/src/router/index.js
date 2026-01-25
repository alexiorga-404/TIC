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
        {
            path: '/cart',
            name: 'Cart',
            component: () => import('../components/Cart.vue'),
        },
        {
            path: '/orders',
            name: 'Orders',
            component: () => import('../components/Orders.vue'),
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
	}else if(!authStore.user && (to.name === 'Cart' || to.path === '/cart' || to.name === 'Orders' || to.path === '/orders')){
        next('/login')
    }
     else {
		next()
	}

})

export default router