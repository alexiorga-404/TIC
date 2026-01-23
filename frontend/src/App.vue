

<template>
  <nav>
    <router-link to="/"> Home</router-link> |
    <router-link v-if="!authStore.user" to="/login"> Login</router-link>
      <span v-else>
        Hello, {{ authStore.user.email }} !
        <button @click="handleLogout"> Logout</button>
      </span>
  </nav>
  <router-view />
</template>

<script setup>
import { useAuthStore } from './stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout =  async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
