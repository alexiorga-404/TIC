<template>
  <div class="register-container">
    <h2>Create Account</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
      
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Creating account...' : 'Register' }}
      </button>
      
      <p v-if="error" class="error">{{ error }}</p>
      <p>Already have an account? <router-link to="/login">Login here</router-link></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const authStore = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  error.value = ''
  
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match!"
    return
  }

  const success = await authStore.register(email.value, password.value)
  if (success) {
    router.push('/') 
  } else {
    error.value = authStore.error || "Registration failed."
  }
}
</script>

<style scoped>

.register-container { max-width: 400px; margin: 2rem auto; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
form { display: flex; direction: column; gap: 1rem; }
input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 0.7rem; background: #28a745; color: white; border: none; cursor: pointer; }
.error { color: red; font-size: 0.9rem; }
</style>