<template>
  <div class="home">
    <h1>Products</h1>

   
    <div v-if="store.loading" class="loading">
      <p>Loading products...</p>
    </div>

    
    <div v-if="store.error" class="error">
      <p>{{ store.error }}</p>
    </div>

    
    <div v-if="!store.loading && store.products.length > 0" class="products-grid">
      <div v-for="product in store.products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p class="price">${{ product.price }}</p>
        <p class="category">{{ product.category.name }}</p>
      </div>
    </div>

    
    <div v-if="!store.loading && store.products.length === 0" class="empty">
      <p>No products found.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'

const store = useProductStore()

onMounted(() => {
  store.fetchProducts()
})
</script>

<style scoped>
.home {
  padding: 2rem;
}

.loading,
.error,
.empty {
  padding: 1rem;
  text-align: center;
  margin: 1rem 0;
}

.error {
  color: red;
  background-color: #ffe6e6;
  border-radius: 4px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #f9f9f9;
  transition: box-shadow 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-card h3 {
  margin-top: 0;
  color: #333;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #007bff;
  margin: 0.5rem 0;
}

.category {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}
</style>