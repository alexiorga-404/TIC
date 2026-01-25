const { admin } = require('../config/firebase')


async function verifyAuth(req, res, next) {
	try {
		const authHeader = req.headers.authorization || ''
		const parts = authHeader.split(' ')
		
		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			return res.status(401).json({ error: 'Unauthorized: missing Bearer token' })
		}

		const idToken = parts[1]
		const decoded = await admin.auth().verifyIdToken(idToken)
		
		req.user = {
			uid: decoded.uid,
			email: decoded.email,
			isAdmin: !!decoded.admin,
		}
		
		next()
	} catch (err) {
		console.error('Auth verification error:', err.message)
		return res.status(401).json({ error: 'Unauthorized: invalid token' })
	}
}

module.exports = { verifyAuth }
