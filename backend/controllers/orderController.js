const e = require('express')
const { db } = require('../config/firebase')


async function createOrder(req, res) {
	try {
		const { userId, items, totalPrice, shippingDetails } = req.body

		if (!userId || !items || !totalPrice || !shippingDetails) {
			return res.status(400).json({ error: 'Missing required fields' })
		}

		//ownership check 
		if (req.user.uid !== userId && !req.user.isAdmin) {
			return res.status(403).json({ error: 'Forbidden: cannot create order for another user' })
		}

		//  verify all productIds exist
		const productIds = items.map(item => item.productId)
		const productChecks = await Promise.all(
			productIds.map(async (productId) => {
				const snap = await db.collection('products').doc(productId).get()
				return { productId, exists: snap.exists }
			})
		)
		
		const invalidProducts = productChecks.filter(p => !p.exists)
		if (invalidProducts.length > 0) {
			return res.status(400).json({ 
				error: 'Invalid product(s) in order',
				invalidProducts: invalidProducts.map(p => p.productId)
			})
		}

		const clientName = (shippingDetails.fullName || '').trim()
		const clientPhone = (shippingDetails.phone || '').trim()
		const clientAddress = (shippingDetails.address || '').trim()

		if (!clientName || !clientPhone || !clientAddress) {
			return res.status(400).json({ error: 'Missing shipping details' })
		}

		if(/[^a-zA-Z]/.test(clientName) || clientName.length < 10){

			return res.status(400).json({ error: 'Invalid name in shipping details' })

		}else if(/[^0-9]/.test(clientPhone) || clientPhone.length < 10){

			return res.status(400).json({ error: 'Invalid phone in shipping details' })

		}else if(/[^a-zA-Z0-9]/.test(clientAddress) || clientAddress.length < 10){

			return res.status(400).json({ error: 'Invalid address in shipping details' })
			
		}

		const orderData = {
			userId,
			items,
			totalPrice,
			shippingDetails,
			status: 'pending',
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const docRef = await db.collection('orders').add(orderData)

		return res.status(201).json({
			id: docRef.id,
			...orderData,
		})
	} catch (error) {
		console.error('Error creating order:', error)
		return res.status(500).json({ error: 'Failed to create order' })
	}
}


async function getOrdersByUserId(req, res) {
	try {
		const { userId } = req.params

		if (!userId) {
			return res.status(400).json({ error: 'userId is required' })
		}

		
		if (req.user.uid !== userId && !req.user.isAdmin) {
			return res.status(403).json({ error: 'Forbidden: cannot access another user\'s orders' })
		}

		const snapshot = await db
			.collection('orders')
			.where('userId', '==', userId)
			.orderBy('createdAt', 'desc')
			.get()

		const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

		return res.status(200).json(orders)
	} catch (error) {
		console.error('Error fetching orders:', error)
		return res.status(500).json({ error: 'Failed to fetch orders' })
	}
}


async function getOrderById(req, res) {
	try {
		const { orderId } = req.params

		if (!orderId) {
			return res.status(400).json({ error: 'orderId is required' })
		}

		const docSnap = await db.collection('orders').doc(orderId).get()

		if (!docSnap.exists) {
			return res.status(404).json({ error: 'Order not found' })
		}

		const order = { id: docSnap.id, ...docSnap.data() }

		
		if (req.user.uid !== order.userId && !req.user.isAdmin) {
			return res.status(403).json({ error: 'Forbidden: cannot access another user\'s order' })
		}

		return res.status(200).json(order)
	} catch (error) {
		console.error('Error fetching order:', error)
		return res.status(500).json({ error: 'Failed to fetch order' })
	}
}


async function updateOrderStatus(req, res) {
	try {
		const { orderId } = req.params
		const { status } = req.body

		if (!orderId) {
			return res.status(400).json({ error: 'orderId is required' })
		}

		if (!status) {
			return res.status(400).json({ error: 'status is required' })
		}

		
		const allowedStatuses = ['cancelled', 'pending']
		if (!allowedStatuses.includes(status)) {
			return res.status(400).json({ error: 'Invalid status. Allowed values: cancelled, pending' })
		}

		const docRef = db.collection('orders').doc(orderId)
		const docSnap = await docRef.get()

		if (!docSnap.exists) {
			return res.status(404).json({ error: 'Order not found' })
		}

		const order = { id: docSnap.id, ...docSnap.data() }

		
		if (req.user.uid !== order.userId && !req.user.isAdmin) {
			return res.status(403).json({ error: 'Forbidden: cannot update another user\'s order' })
		}

		await docRef.update({
			status,
			updatedAt: new Date(),
		})

		const updatedDoc = await docRef.get()
		const updatedOrder = { id: updatedDoc.id, ...updatedDoc.data() }

		return res.status(200).json(updatedOrder)
	} catch (error) {
		console.error('Error updating order:', error)
		return res.status(500).json({ error: 'Failed to update order' })
	}
}


async function deleteOrder(req, res) {
	try {
		const { orderId } = req.params

		if (!orderId) {
			return res.status(400).json({ error: 'orderId is required' })
		}

		const docRef = db.collection('orders').doc(orderId)
		const docSnap = await docRef.get()

		if (!docSnap.exists) {
			return res.status(404).json({ error: 'Order not found' })
		}

		const order = { id: docSnap.id, ...docSnap.data() }

		
		if (req.user.uid !== order.userId && !req.user.isAdmin) {
			return res.status(403).json({ error: 'Forbidden: cannot delete another user\'s order' })
		}

		
		if (order.status !== 'cancelled') {
			return res.status(400).json({ error: 'Only cancelled orders can be deleted' })
		}

		await docRef.delete()

		return res.status(200).json({ message: 'Order deleted successfully', id: orderId })
	} catch (error) {
		console.error('Error deleting order:', error)
		return res.status(500).json({ error: 'Failed to delete order' })
	}
}

module.exports = {
	createOrder,
	getOrdersByUserId,
	getOrderById,
	updateOrderStatus,
	deleteOrder,
}
