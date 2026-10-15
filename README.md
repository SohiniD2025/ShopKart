# 🛒 ShopKart — Full-Stack E-Commerce Application

ShopKart is a full-stack e-commerce web application built using the MERN stack. It provides a shopping experience with product browsing, secure user authentication, cart management, wishlist functionality, and online payment integration using Razorpay.

The project demonstrates full-stack development concepts, REST API integration, database management, authentication, and payment processing.

## ✨ Features

- **User Authentication:** Register, log in, access protected routes, and log out securely.
- **Product Browsing:** Explore products and view product information.
- **Shopping Cart:** Add products to the cart and manage quantities.
- **Wishlist:** Save products for later.
- **Checkout:** Initiate the checkout process for cart items.
- **Online Payments:** Integrate Razorpay for payment processing.
- **Payment Verification:** Verify payment signatures on the backend before treating a payment as successful.
- **Order Management:** Create orders and access order history and order details.
- **Persistent Data:** Store application data in MongoDB.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt, HttpOnly cookies |
| API Communication | Axios, REST APIs |
| Payment Gateway | Razorpay |
| Development Tools | Git, GitHub, Postman, VS Code |

## 🏗️ Project Structure

```text
ShopKart/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── index.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

*Note: The structure above is illustrative. Adjust it to match the actual files in your repository.*

## 🔐 Authentication and Security

ShopKart implements JWT-based authentication to protect user-specific operations.

- Passwords are hashed using bcrypt.
- Authentication tokens are stored in HttpOnly cookies.
- Authentication middleware protects restricted backend routes.
- CORS and credential settings support authenticated frontend requests.
- Payment signature verification helps validate Razorpay payment responses.
- Razorpay secret credentials remain on the backend.

## 💳 Payment Integration

ShopKart integrates Razorpay to support the checkout workflow.

The payment flow includes:

1. The frontend requests the creation of a payment order.
2. The backend creates an order with Razorpay.
3. The frontend initiates the Razorpay checkout.
4. Razorpay returns payment details after the payment attempt.
5. The backend verifies the payment signature.
6. Verified payments can be used to finalize the application's order workflow.

Razorpay Test Mode can be used during development without processing real payments.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB Atlas or a compatible MongoDB instance
- Git
- A Razorpay account for testing the payment integration

### 1. Clone the repository

```bash
git clone https://github.com/SohiniD2025/ShopKart.git
cd ShopKart
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the environment variables required by your application.

Example:

```env
dbUrl=your_mongodb_connection_string
jwt_secret=your_jwt_secret
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Use the exact variable names expected by your backend code. Keep your real credentials private and never commit your `.env` file.

Start the backend using the script configured in `backend/package.json`:

```bash
npm run dev
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create the frontend `.env` file:

```env
VITE_API_URL=http://localhost:8080/customers
```

Use the API base URL expected by your frontend Axios configuration.

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

## 🧪 Testing

Use Postman to test backend API endpoints and verify application behaviour, including:

- User registration and login
- Access to protected routes
- Cart and wishlist operations
- Order creation and retrieval
- Razorpay payment order creation and signature verification

Use Razorpay Test Mode credentials when testing payments.

## 🎯 Learning Outcomes

This project provides practical experience with:

- Building and integrating a React frontend with an Express backend
- Designing RESTful APIs
- Working with MongoDB and Mongoose
- Implementing JWT authentication and protected routes
- Managing application state and API requests
- Integrating a third-party payment gateway
- Validating payment responses securely
- Organizing a full-stack application into maintainable modules

## 👩‍💻 Author

**Sohini Datta**

GitHub: [@SohiniD2025](https://github.com/SohiniD2025)

---

*Built as a hands-on full-stack development project using the MERN stack.*