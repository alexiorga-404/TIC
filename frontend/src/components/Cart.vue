<template>
	<div class="cart-page">
		<section class="card-block">
			<header class="section-header">
				<div>
					<p class="eyebrow">Cart Summary</p>
					<h2>Review your items</h2>
					<p class="muted">Update quantities or remove items before checkout.</p>
				</div>
				<div class="pill">{{ cartItems.length }} item{{ cartItems.length === 1 ? '' : 's' }}</div>
			</header>

			<div v-if="cartItems.length" class="table-wrapper">
				<table class="cart-table">
					<thead>
						<tr>
							<th>Product</th>
							<th class="qty">Qty</th>
							<th class="price">Price</th>
							<th class="price">Subtotal</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in cartItems" :key="item.id">
							<td>
								<div class="product-name">{{ item.name }}</div>
								<div class="product-meta">{{ item.category?.name || 'Product' }}</div>
							</td>
							<td class="qty">
								<div class="quantity-control">
									<button type="button" @click="changeQuantity(item.id, -1)">-</button>
									<input
										type="number"
										min="1"
										:value="item.quantity"
										@input="onQuantityInput(item.id, $event.target.value)"
									/>
									<button type="button" @click="changeQuantity(item.id, 1)">+</button>
								</div>
							</td>
							<td class="price">{{ formatCurrency(item.price) }}</td>
							<td class="price">{{ formatCurrency(item.price * item.quantity) }}</td>
							<td class="actions">
								<button class="ghost" type="button" @click="removeItem(item.id)">Remove</button>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="table-footer">
					<div class="total-row">
						<span>Total Price</span>
						<strong>{{ formatCurrency(totalPrice) }}</strong>
					</div>
				</div>
			</div>

			<div v-else class="empty">
				<p>Your cart is empty.</p>
				<router-link class="cta" to="/">Continue shopping</router-link>
			</div>
		</section>

		<section class="card-block">
			<header class="section-header">
				<div>
					<p class="eyebrow">Checkout</p>
					<h2>Shipping details</h2>
					<p class="muted">Tell us where to deliver your order.</p>
				</div>
				<div class="total-badge">
					<span>Total</span>
					<strong>{{ formatCurrency(totalPrice) }}</strong>
				</div>
			</header>

			<form class="checkout-form" @submit.prevent="placeOrder">
				<div class="form-grid">
					<label class="field">
						<span>Full Name</span>
						<input v-model="form.fullName" type="text" placeholder="Alex Smith" required />
					</label>
					<label class="field">
						<span>Address</span>
						<input v-model="form.address" type="text" placeholder="123 Main St, City" required />
					</label>
					<label class="field">
						<span>Phone</span>
						<input v-model="form.phone" type="tel" placeholder="(555) 123-4567" required />
					</label>
				</div>

				<div class="form-footer">
					<div class="messages">
						<p v-if="error" class="error">{{ error }}</p>
						<p v-if="message" class="success">{{ message }}</p>
					</div>
					<button type="submit" :disabled="loading || !cartItems.length || !isFormValid">
						{{ loading ? 'Placing order...' : 'Place Order' }}
					</button>
				</div>
			</form>
		</section>
	</div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
	fullName: '',
	address: '',
	phone: '',
})

const loading = ref(false)
const error = ref('')
const message = ref('')

const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)
const isFormValid = computed(
	() => form.fullName.trim() && form.address.trim() && form.phone.trim()
)

const formatCurrency = (value) => {
	const amount = Number(value) || 0
	return `$${amount.toFixed(2)}`
}

const changeQuantity = (id, delta) => {
	const current = cartItems.value.find((item) => item.id === id)
	if (!current) return
	const nextQty = Math.max(1, (Number(current.quantity) || 1) + delta)
	cartStore.updateQuantity(id, nextQty)
}

const onQuantityInput = (id, value) => {
	cartStore.updateQuantity(id, value)
}

const removeItem = (id) => {
	cartStore.removeFromCart(id)
}

const placeOrder = async () => {
	error.value = ''
	message.value = ''

	if (!cartItems.value.length) {
		error.value = 'Your cart is empty.'
		return
	}

	if (!isFormValid.value) {
		error.value = 'Please complete all fields.'
		return
	}

	if (!authStore.user) {
		router.push('/login')
		return
	}

	loading.value = true

	try {
		const payload = {
			userId: authStore.user.uid,
			items: cartItems.value.map((item) => ({
				productId: item.id,
				name: item.name,
				price: Number(item.price) || 0,
				quantity: Number(item.quantity) || 1,
			})),
			totalPrice: Number(totalPrice.value) || 0,
			shippingDetails: {
				fullName: form.fullName.trim(),
				address: form.address.trim(),
				phone: form.phone.trim(),
			},
		}

		await api.post('/orders', payload)
		cartStore.clearCart()
		message.value = 'Order placed successfully.'
		router.push('/orders')
	} catch (err) {
		error.value = err?.response?.data?.error || 'Failed to place order. Please try again.'
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
.cart-page {
	display: grid;
	grid-template-columns: 1.2fr 0.9fr;
	gap: 1.5rem;
	padding: 1rem;
	background: linear-gradient(120deg, #f7f7fb, #eef2f7);
}

.card-block {
	background: #ffffff;
	border: 1px solid #e5e7eb;
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
	margin-bottom: 1rem;
}

.eyebrow {
	text-transform: uppercase;
	letter-spacing: 0.08em;
	font-size: 0.75rem;
	color: #6b7280;
	margin: 0;
}

h2 {
	margin: 0.1rem 0;
	color: #111827;
}

.muted {
	color: #6b7280;
	margin: 0;
}

.pill {
	background: #eef2ff;
	color: #3730a3;
	border-radius: 999px;
	padding: 0.5rem 0.9rem;
	font-weight: 600;
	font-size: 0.9rem;
}

.total-badge {
	background: #0f172a;
	color: #ffffff;
	border-radius: 12px;
	padding: 0.75rem 1rem;
	text-align: right;
}

.total-badge span {
	display: block;
	font-size: 0.85rem;
	color: #cbd5e1;
}

.total-badge strong {
	font-size: 1.2rem;
}

.table-wrapper {
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	overflow: hidden;
}

.cart-table {
	width: 100%;
	border-collapse: collapse;
}

.cart-table th,
.cart-table td {
	padding: 0.9rem 1rem;
	border-bottom: 1px solid #f1f5f9;
	text-align: left;
	color: #1f2937;
}

.cart-table th.qty,
.cart-table td.qty,
.cart-table th.price,
.cart-table td.price {
	text-align: center;
}

.product-name {
	font-weight: 600;
	margin-bottom: 0.2rem;
}

.product-meta {
	color: #6b7280;
	font-size: 0.9rem;
}

.quantity-control {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	background: #f8fafc;
	padding: 0.35rem;
	border-radius: 10px;
	border: 1px solid #e5e7eb;
}

.quantity-control button {
	width: 32px;
	height: 32px;
	border: none;
	background: #0f172a;
	color: #ffffff;
	border-radius: 8px;
	cursor: pointer;
}

.quantity-control input {
	width: 56px;
	padding: 0.35rem;
	text-align: center;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
}

.actions {
	text-align: right;
}

.actions .ghost {
	border: none;
	background: transparent;
	color: #ef4444;
	font-weight: 600;
	cursor: pointer;
}

.table-footer {
	display: flex;
	justify-content: flex-end;
	padding: 1rem;
	background: #f8fafc;
}

.total-row {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 1rem;
}

.total-row strong {
	font-size: 1.25rem;
}

.empty {
	text-align: center;
	padding: 2rem;
	color: #6b7280;
}

.cta {
	display: inline-block;
	margin-top: 0.5rem;
	color: #0f172a;
	font-weight: 700;
}

.checkout-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.form-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	font-weight: 600;
	color: #111827;
}

.field input {
	padding: 0.85rem 0.9rem;
	border: 1px solid #e5e7eb;
	border-radius: 10px;
	font-size: 1rem;
}

.form-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	flex-wrap: wrap;
}

.messages {
	min-height: 1.25rem;
}

.error {
	color: #b91c1c;
	font-weight: 600;
}

.success {
	color: #15803d;
	font-weight: 600;
}

button[type='submit'] {
	padding: 0.9rem 1.4rem;
	border: none;
	border-radius: 12px;
	background: linear-gradient(135deg, #111827, #1f2937);
	color: #ffffff;
	font-size: 1rem;
	cursor: pointer;
	transition: transform 0.15s ease, box-shadow 0.15s ease;
}

button[type='submit']:hover:not(:disabled) {
	transform: translateY(-1px);
	box-shadow: 0 10px 20px rgba(15, 23, 42, 0.18);
}

button[type='submit']:disabled {
	background: #cbd5e1;
	cursor: not-allowed;
}

@media (max-width: 960px) {
	.cart-page {
		grid-template-columns: 1fr;
	}

	.section-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.cart-table th.qty,
	.cart-table td.qty,
	.cart-table th.price,
	.cart-table td.price {
		white-space: nowrap;
	}
}
</style>
