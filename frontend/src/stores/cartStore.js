import { defineStore } from 'pinia'

const STORAGE_KEY = 'cart_items'

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to load cart from storage:', err)
    return []
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.error('Failed to save cart to storage:', err)
  }
}

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    items: loadCartFromStorage(),
  }),

  getters: {
    totalPrice: (state) => state.items.reduce((sum, item) => {
      const price = Number(item.price) || 0
      const qty = Number(item.quantity) || 0
      return sum + price * qty
    }, 0),
    totalItems: (state) => state.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
  },

  actions: {
    addToCart(product, quantity = 1) {
      if (!product || !product.id) return
      const safeQty = Math.max(1, Number(quantity) || 1)
      const existing = this.items.find((item) => item.id === product.id)

      if (existing) {
        existing.quantity += safeQty
      } else {
        this.items.push({ ...product, quantity: safeQty })
      }

      saveCartToStorage(this.items)
    },

    updateQuantity(productId, quantity) {
      const safeQty = Math.max(1, Number(quantity) || 1)
      const item = this.items.find((entry) => entry.id === productId)
      if (item) {
        item.quantity = safeQty
        saveCartToStorage(this.items)
      }
    },

    removeFromCart(productId) {
      this.items = this.items.filter((item) => item.id !== productId)
      saveCartToStorage(this.items)
    },

    clearCart() {
      this.items = []
      saveCartToStorage(this.items)
    },
  },
})

export default useCartStore
