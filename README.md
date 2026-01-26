# AplicatieTIC - E-Commerce Platform

A modern full-stack e-commerce application built with Vue.js, Node.js, and Firebase.

## Features

- **User Authentication**: Register and login with email/password
- **Product Catalog**: Browse and view available products
- **Shopping Cart**: Add items to cart, manage quantities
- **Checkout**: Complete orders with shipping details
- **Order Management**: View order history and manage orders
- **Error Handling**: User-friendly error messages for all operations
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next-generation build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **SweetAlert2** - Beautiful modals and notifications
- **Firebase** - Authentication

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Firebase Admin SDK** - Backend authentication & database
- **Cors** - Cross-origin resource sharing

## Project Structure

```
.
├── frontend/                    # Vue.js client application
│   ├── src/
│   │   ├── components/         # Vue components
│   │   │   ├── Cart.vue
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Orders.vue
│   │   │   └── Register.vue
│   │   ├── stores/             # Pinia state stores
│   │   │   ├── authStore.js
│   │   │   ├── cartStore.js
│   │   │   └── productStore.js
│   │   ├── router/             # Route definitions
│   │   ├── api/                # API configuration
│   │   └── main.js
│   └── package.json
│
├── backend/                     # Node.js server
│   ├── config/                 # Configuration files
│   │   └── firebase.js
│   ├── controllers/            # Route handlers
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js
│   ├── routes/                 # API routes
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd AplicatieTIC
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
PORT=3000
```

### Frontend (.env.local)
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID

### Orders
- `GET /orders/user/:userId` - Get user's orders
- `POST /orders` - Create new order
- `PATCH /orders/:id` - Update order status
- `DELETE /orders/:id` - Delete order

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- Uses Firebase Authentication

## Usage

1. **Register**: Create a new account with email and password
2. **Browse Products**: View all available products on the home page
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Checkout**: Review cart items and enter shipping details
5. **Place Order**: Complete the purchase
6. **View Orders**: Check order history and manage orders

## Form Validation

### Authentication
- Email: Valid email format required
- Password: Minimum 6 characters

### Checkout
- Full Name: Letters and spaces only, minimum 2 characters
- Address: Letters and numbers only, minimum 5 characters
- Phone: Numbers and symbols only, minimum 10 digits

## Error Handling

The application provides user-friendly error messages for:
- Email already in use
- Invalid email format
- Wrong password
- Invalid input
- Network errors

## License

This project is licensed under the MIT License.
