import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/products')
        this.products = response.data
      } catch (err) {
        this.error = err.message || 'Failed to fetch products'
        console.error('Error fetching products:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/products/${id}`)
        return response.data
      } catch (err) {
        this.error = err.message || 'Failed to fetch product'
        console.error(`Error fetching product ${id}:`, err)
        return null
      } finally {
        this.loading = false
      }
    },
  },
})