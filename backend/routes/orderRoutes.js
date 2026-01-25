const express = require('express')
const {
	createOrder,
	getOrdersByUserId,
	getOrderById,
	updateOrderStatus,
	deleteOrder,
} = require('../controllers/orderController')
const { verifyAuth } = require('../middleware/auth')

const router = express.Router()

router.use(verifyAuth)

router.post('/', createOrder)

router.get('/user/:userId', getOrdersByUserId)

router.get('/:orderId', getOrderById)

router.patch('/:orderId', updateOrderStatus)

router.delete('/:orderId', deleteOrder)

module.exports = router
