

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <router-link to="/">Home</router-link>
      </div>
      <nav class="top-links">
        <router-link to="/register" v-if="!authStore.user">Register</router-link>
        <router-link to="/login" v-if="!authStore.user">Login</router-link>
        <router-link to="/cart" v-if="authStore.user" class="cart-chip">
          Cart
          <span class="badge">{{ cartStore.totalItems }}</span>
        </router-link>
        <span v-if="authStore.user" class="user-block">
          Hello, {{ authStore.user.email.split('@')[0] }}!
          <button class="ghost" @click="handleLogout">Logout</button>
        </span>
        <button v-if="authStore.user" class="hamburger" @click="toggleSidebar" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>

    <div class="layout">
      <div v-if="sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>
      <aside v-if="authStore.user" :class="['sidebar', { open: sidebarOpen }]">
        <div class="sidebar-header">
          <div class="sidebar-section">Navigation</div>
          <button class="close-btn" @click="closeSidebar">×</button>
        </div>
        <router-link to="/orders" class="sidebar-link" @click="closeSidebar"> My Orders</router-link>
      </aside>

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from './stores/authStore'
import { useCartStore } from './stores/cartStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
  color: #111827;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: #0f172a;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  column-gap: 1.25rem;
}

.brand a {
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
}

.brand a:hover {
  background: #1e293b;
}

.top-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.top-links a {
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 600;
  
}

.top-links a.router-link-active {
  color: #fff;
}

.cart-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.6rem;
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 999px;
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.cart-chip:hover {
  background: hsla(230, 55.7%, 44.5%, 0.86);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  padding: 0 0.4rem;
  height: 22px;
  background: #22c55e;
  color: #0f172a;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
}

.user-block {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.ghost {
  border: 1px solid #334155;
  background: transparent;
  color: #e5e7eb;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.ghost:hover {
  background: #ef4444;
  border-color: #dc2626;
  color: #fff;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 3px;
  background: #e5e7eb;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger:hover span {
  background: #fff;
}

.hamburger:hover{
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.layout {
  flex: 1;
  display: flex;
  min-height: 0;
  position: relative;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  max-width: 80vw;
  background: #111827;
  color: #e5e7eb;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: #e5e7eb;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-section {
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #9ca3af;
}

.sidebar-link {
  display: block;
  padding: 0.6rem 0.75rem;
  color: #e5e7eb;
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid transparent;
}

.sidebar-link.router-link-active {
  background: #1f2937;
  border-color: #334155;
}

.sidebar-link:hover {
  background: #374151;
}

.content {
  flex: 1;
  padding: 1.5rem;
  background: #f5f6fa;
  min-height: 0;
}

@media (max-width: 900px) {
  .hamburger {
    display: flex;
  }
}

@media (min-width: 901px) {
  .hamburger {
    display: flex;
  }
}
</style>
