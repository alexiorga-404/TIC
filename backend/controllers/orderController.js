const { db } = require('../config/firebase')


async function createOrder(req, res) {
	try {
		const { userId, items, totalPrice, shippingDetails } = req.body

		if (!userId || !items || !totalPrice || !shippingDetails) {
			return res.status(400).json({ error: 'Missing required fields' })
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

		const docRef = db.collection('orders').doc(orderId)
		const docSnap = await docRef.get()

		if (!docSnap.exists) {
			return res.status(404).json({ error: 'Order not found' })
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
