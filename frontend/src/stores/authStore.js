import {defineStore} from 'pinia'
import{
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'
import {auth} from '../firebase'

const getErrorMessage = (err) => {
  const code = err.code
  const errorMap = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password is too weak (min 6 characters)',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many login attempts, please try again later',
    'auth/invalid-credential': 'Invalid password or email provided',
  }
  return errorMap[code] || err.message || 'An error occurred'
}

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    clearError() {
      this.error = null
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        return userCredential.user
      } catch (err) {
        this.error = getErrorMessage(err)
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
        this.error = getErrorMessage(err)
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
        this.error = getErrorMessage(err)
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