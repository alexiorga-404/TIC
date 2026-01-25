<template>
  <div class="orders-page">
    <header class="page-header">
      <div>
        <h1>My Orders</h1>
        <p class="subtitle">View and manage your order history</p>
      </div>
      <div class="stats-badge">
        <span>Total Orders</span>
        <strong>{{ orders.length }}</strong>
      </div>
    </header>

    <div v-if="loading" class="loading">
      <p>Loading your orders...</p>
    </div>

    <div v-if="error" class="error-banner">
      <p>{{ error }}</p>
    </div>

    <div v-if="!loading && orders.length === 0" class="empty-state">
      <p>You haven't placed any orders yet.</p>
      <router-link class="cta-btn" to="/">Start Shopping</router-link>
    </div>

    <div v-if="!loading && orders.length > 0" class="orders-grid">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-id">
            <span class="label">Order ID</span>
            <strong>{{ order.id }}</strong>
          </div>
          <span :class="['status-badge', order.status]">{{ order.status }}</span>
        </div>

        <div class="order-details">
          <div class="detail-row">
            <span class="icon">📅</span>
            <div>
              <span class="detail-label">Date</span>
              <span class="detail-value">{{ formatDate(order.createdAt) }}</span>
            </div>
          </div>

          <div class="detail-row">
            <span class="icon">💰</span>
            <div>
              <span class="detail-label">Total</span>
              <span class="detail-value">{{ formatCurrency(order.totalPrice) }}</span>
            </div>
          </div>

          <div class="detail-row">
            <span class="icon">📦</span>
            <div>
              <span class="detail-label">Items</span>
              <span class="detail-value">{{ order.items?.length || 0 }} item(s)</span>
            </div>
          </div>
        </div>

        <div class="order-items">
          <div v-for="(item, idx) in order.items" :key="idx" class="item-line">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>{{ formatCurrency(item.price * item.quantity) }}</span>
          </div>
        </div>

        <div class="order-shipping">
          <span class="detail-label">Shipping to:</span>
          <p>{{ order.shippingDetails?.fullName }}</p>
          <p>{{ order.shippingDetails?.address }}</p>
          <p>{{ order.shippingDetails?.phone }}</p>
        </div>

        <div class="order-actions">
          <button
            v-if="order.status === 'pending'"
            class="btn-cancel"
            @click="cancelOrder(order.id)"
            :disabled="actionLoading[order.id]"
          >
            {{ actionLoading[order.id] ? 'Cancelling...' : 'Cancel Order' }}
          </button>
          <button
            v-if="order.status === 'cancelled'"
            class="btn-delete"
            @click="deleteOrder(order.id)"
            :disabled="actionLoading[order.id]"
          >
            {{ actionLoading[order.id] ? 'Deleting...' : 'Delete' }}
          </button>
          <p v-if="order.status === 'pending'" class="info-text">Cancel order first to delete it</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const orders = ref([])
const loading = ref(false)
const error = ref('')
const actionLoading = reactive({})

const fetchOrders = async () => {
  if (!authStore.user) {
    router.push('/login')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await api.get(`/orders/user/${authStore.user.uid}`)
    orders.value = response.data
  } catch (err) {
    error.value = err?.response?.data?.error || 'Failed to load orders'
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

const cancelOrder = async (orderId) => {
  actionLoading[orderId] = true
  error.value = ''

  try {
    await api.patch(`/orders/${orderId}`, { status: 'cancelled' })
    const orderIndex = orders.value.findIndex((o) => o.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled'
    }
  } catch (err) {
    error.value = err?.response?.data?.error || 'Failed to cancel order'
    console.error('Error cancelling order:', err)
  } finally {
    actionLoading[orderId] = false
  }
}

const deleteOrder = async (orderId) => {
  if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
    return
  }

  actionLoading[orderId] = true
  error.value = ''

  try {
    await api.delete(`/orders/${orderId}`)
    orders.value = orders.value.filter((o) => o.id !== orderId)
  } catch (err) {
    error.value = err?.response?.data?.error || 'Failed to delete order'
    console.error('Error deleting order:', err)
  } finally {
    actionLoading[orderId] = false
  }
}

const formatCurrency = (value) => {
  const amount = Number(value) || 0
  return `$${amount.toFixed(2)}`
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  
  let date
  
  
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate()
  } 
  
  else if (timestamp._seconds) {
    date = new Date(timestamp._seconds * 1000)
  }
  
  else {
    date = new Date(timestamp)
  }
  
  
  if (isNaN(date.getTime())) {
    return 'N/A'
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.page-header h1 {
  margin: 0;
  color: #111827;
}

.subtitle {
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.stats-badge {
  background: #111827;
  color: #fff;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  text-align: right;
}

.stats-badge span {
  display: block;
  font-size: 0.85rem;
  color: #cbd5e1;
}

.stats-badge strong {
  font-size: 1.5rem;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.error-banner {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.cta-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #111827;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.order-id {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.cancelled {
  background: #fee;
  color: #991b1b;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.icon {
  font-size: 1.25rem;
}

.detail-label {
  display: block;
  font-size: 0.85rem;
  color: #6b7280;
  text-align: left;
}

.detail-value {
  display: block;
  font-weight: 600;
  color: #111827;
}

.order-items {
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.item-line {
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0;
  font-size: 0.9rem;
  color: #374151;
}

.order-shipping {
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #374151;
}

.order-shipping p {
  margin: 0.15rem 0;
}

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-actions > div {
  display: flex;
  gap: 0.5rem;
}

.info-text {
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
  margin: 0.25rem 0 0 0;
  font-style: italic;
}

.btn-cancel,
.btn-delete {
  flex: 1;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel {
  background: #fbbf24;
  color: #78350f;
}

.btn-cancel:hover:not(:disabled) {
  background: #f59e0b;
}

.btn-delete {
  background: #ef4444;
  color: #fff;
}

.btn-delete:hover:not(:disabled) {
  background: #dc2626;
}

.btn-cancel:disabled,
.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 500px) {
  .orders-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
  }

  .order-actions {
    flex-direction: column;
  }
}
</style>
