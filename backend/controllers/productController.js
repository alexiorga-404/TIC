const { db } = require('../config/firebase')

async function getAllProducts(req, res) {
	try {
		const snapshot = await db.collection('products').get()
		const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
		return res.status(200).json(products)
	} catch (error) {
		console.error('Error fetching products:', error)
		return res.status(500).json({ error: 'Failed to fetch products' })
	}
}

async function getProductById(req, res) {
	try {
		const { id } = req.params
		const docRef = db.collection('products').doc(id)
		const docSnap = await docRef.get()

		if (!docSnap.exists) {
			return res.status(404).json({ error: 'Product not found' })
		}

		const product = { id: docSnap.id, ...docSnap.data() }
		return res.status(200).json(product)
	} catch (error) {
		console.error(`Error fetching product ${req.params?.id}:`, error)
		return res.status(500).json({ error: 'Failed to fetch product' })
	}
}

module.exports = {
	getAllProducts,
	getProductById,
}