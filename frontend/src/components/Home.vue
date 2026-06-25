<template>
  <div class="home">
    <section class="hero">
      <div>
        <p class="eyebrow">Catalog</p>
        <h1>Products</h1>
        <p class="hero-copy">
          Browse available items, add what you need, and checkout from any device.
        </p>
      </div>
    </section>

    <div v-if="store.loading" class="state-panel loading">
      <p>Loading products...</p>
    </div>

    <div v-if="store.error" class="state-panel error">
      <p>{{ store.error }}</p>
    </div>

    <div v-if="!store.loading && store.products.length > 0" class="products-grid">
      <div v-for="product in store.products" :key="product.id" class="product-card">
        <div class="card-top">
          <p class="category">{{ product.category?.name || 'General' }}</p>
          <h3>{{ product.name }}</h3>
        </div>
        <p class="price">${{ product.price }}</p>
        <button class="add-btn" @click="add(product)">Add to Cart</button>
      </div>
    </div>

    <div v-if="!store.loading && store.products.length === 0" class="state-panel empty">
      <p>No products found.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const authStore = useAuthStore()
const store = useProductStore()
const cartStore = useCartStore()

onMounted(() => {
  store.fetchProducts()
})

const add = (product) => {
  if (!authStore.user) {
    router.push({ path: '/login', query: { redirect: '/cart' } })
    return
  }

  cartStore.addToCart(product, 1)
}
</script>

<style scoped>
.home {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: clamp(1rem, 2vw, 2rem);
}

.hero {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.96), rgba(30, 41, 59, 0.94));
  color: #f8fafc;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
}

.eyebrow {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
  color: #93c5fd;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.25rem);
}

.hero-copy {
  margin: 0.75rem 0 0;
  max-width: 58ch;
  color: rgba(248, 250, 252, 0.82);
}

.state-panel {
  padding: 1rem 1.1rem;
  text-align: center;
  margin: 1rem 0 0;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.error {
  color: #b91c1c;
  background: rgba(254, 226, 226, 0.9);
}

.products-grid {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  padding: 1.2rem;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
  border-color: rgba(59, 130, 246, 0.24);
}

.card-top {
  display: grid;
  gap: 0.45rem;
}

.add-btn {
  margin-top: auto;
  width: 100%;
  max-width: 100%;
  display: block;
  padding: 0.85rem 1rem;
  background: linear-gradient(135deg, #111827, #334155);
  color: #fff;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.16);
}

.add-btn:active {
  transform: translateY(0);
}

.product-card h3 {
  margin: 0;
  font-size: 1.05rem;
  color: #0f172a;
}

.price {
  margin: 1rem 0 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f766e;
}

.category {
  margin: 0;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

@media (max-width: 640px) {
  .hero {
    padding: 1.1rem;
    border-radius: 18px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>