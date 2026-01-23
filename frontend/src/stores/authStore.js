import {defineStore} from 'pinia'
import{
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'
import {auth} from '../firebase'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return userCredential.user
      } catch (err) {
        this.error = err.message || 'Login failed'
        console.error('Login error:', err)
        return null
      } finally {
        this.loading = false
      }
    },

    async register(email, password) {
      this.loading = true
      this.error = null
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return userCredential.user
      } catch (err) {
        this.error = err.message || 'Registration failed'
        console.error('Registration error:', err)
        return null
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      try {
        await signOut(auth)
        this.user = null
      } catch (err) {
        this.error = err.message || 'Logout failed'
        console.error('Logout error:', err)
      } finally {
        this.loading = false
      }
    },

    init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user || null
          resolve(user)
        })
      })
    },
  },
})

export default useAuthStore