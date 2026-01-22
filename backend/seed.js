const { db } = require('./config/firebase')
const { faker } = require('@faker-js/faker')

function slugify(text) {
	return String(text)
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

async function generateProducts(count = 50) {
	const products = []

	for (let i = 0; i < count; i++) {
		const name = faker.commerce.productName()
		const categoryName = faker.commerce.department()

		const locationsCount = faker.number.int({ min: 2, max: 4 })
		const totalPlanned = faker.number.int({ min: 50, max: 500 })
		let remaining = totalPlanned
		const locations = []

		for (let j = 0; j < locationsCount; j++) {
			const isLast = j === locationsCount - 1
			const maxAlloc = Math.max(1, remaining - (locationsCount - j - 1))
			const qty = isLast
				? remaining
				: faker.number.int({ min: 1, max: Math.max(1, maxAlloc) })
			remaining -= qty
			locations.push({
				warehouse: `${faker.location.city()} Warehouse`,
				quantity: qty,
			})
		}

		const total = locations.reduce((sum, l) => sum + l.quantity, 0)

		const product = {
			name,
			price: parseFloat(
				// faker.commerce.price returns string; convert to number
				faker.commerce.price({ min: 10, max: 999, dec: 2 })
			),
			description: faker.commerce.productDescription(),
			slug: slugify(name),
			category: {
				id: faker.string.uuid(),
				name: categoryName,
				features: [
					faker.word.adjective(),
					faker.word.adjective(),
					faker.word.adjective(),
				],
			},
			inventory: {
				total,
				locations,
			},
			metadata: {
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		}

		products.push(product)
	}

	return products
}

async function seed(count = 50) {
	const products = await generateProducts(count)
	console.log(`Prepared ${products.length} products. Starting batch writes...`)

	let batch = db.batch()
	let opsInBatch = 0
	let written = 0
	const commits = []

	for (let i = 0; i < products.length; i++) {
		const ref = db.collection('products').doc()
		batch.set(ref, products[i])
		opsInBatch++

		if (opsInBatch >= 450) {
			commits.push(batch.commit())
			written += opsInBatch
			console.log(`Committed ${written} products so far...`)
			batch = db.batch()
			opsInBatch = 0
		}
	}

	if (opsInBatch > 0) {
		commits.push(batch.commit())
		written += opsInBatch
	}

	await Promise.all(commits)
	console.log(`Seeding complete. Total written: ${written}`)
}

if (require.main === module) {
	const count = Number(process.argv[2]) || 50
	console.log(`Seeding ${count} products into Firestore 'products' collection...`)
	seed(count)
		.then(() => process.exit(0))
		.catch((err) => {
			console.error('Seeding failed:', err)
			process.exit(1)
		})
}

module.exports = { generateProducts, seed }
