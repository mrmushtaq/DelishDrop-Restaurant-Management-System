# 🍃 DelishDrop
### Restaurant Food Ordering & Management System

> A full-stack MERN web application for online food ordering with a complete restaurant admin panel.

---

## 🌐 Live Demo

**[🚀 View Deployed App](https://delish-drop-restaurant-management-by-mushtaq.vercel.app)**

> Hosted on Vercel — Frontend | MongoDB Atlas — Database

---

## 📋 Project Description

DelishDrop is a full-stack MERN web application that solves a real-life restaurant food ordering and management problem. Customers can browse the menu, search and filter items, manage their cart, and place orders. Restaurant owners get a secure admin panel to manage food items, handle orders, and monitor business performance.

---

## ✨ Features

### Customer Features
- User registration and login with JWT authentication
- Browse restaurant menu by category
- Search and filter food items
- Add items to cart with quantity control (increase / decrease / remove)
- Automatic price and discount calculation
- Place Cash On Delivery orders
- View and track order status in real time

### Restaurant Admin Features
- Secure admin login (no public admin registration)
- Add, update, and delete food items
- Manage item details: name, price, category, description, discount, images, availability
- Manage all customer orders and update their status
- Order flow: **Pending → Preparing → Delivered → Cancelled**

### Admin Dashboard
- Total revenue and daily income
- Total, pending, completed, and cancelled orders
- Total registered customers
- Popular food items
- Recent orders list

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](Output%20Screenshots/ss1-homepage.png)

### 🍔 Menu Page
![Menu Page](Output%20Screenshots/ss2-menu.png)

### 🔐 Sign In
![Sign In](Output%20Screenshots/ss3-login.png)

### 📝 Register
![Register](Output%20Screenshots/ss4-register.png)

### 👤 Customer Profile
![Customer Profile](Output%20Screenshots/ss5-profile.png)

### ✅ Order Placed
![Order Placed](Output%20Screenshots/ss6-order-placed.png)

### 📊 Admin Dashboard
![Admin Dashboard](Output%20Screenshots/ss7-admin-dashboard.png)

### 📦 Admin — Manage Orders
![Manage Orders](Output%20Screenshots/ss8-admin-orders.png)

### 🍽️ Admin — Manage Foods
![Manage Foods](Output%20Screenshots/ss9-manage-foods.png)

### ➕ Admin — Add Food Item
![Add Food Item](Output%20Screenshots/ss10-add-food.png)

### 🗄️ MongoDB Atlas — Database
![MongoDB Atlas](Output%20Screenshots/ss11-mongodb-atlas.png)

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React JS, React Router DOM, Context API, Axios, Tailwind CSS |
| Backend | Node.js, Express.js, JWT, Express Validator, Bcrypt |
| Database | MongoDB Atlas, Mongoose ODM |
| Deployment | Vercel (Frontend), MongoDB Atlas (Database) |

---

## 🏗️ Project Architecture

Three-tier architecture:

1. **Presentation Layer** — React frontend (UI & user interactions)
2. **Business Logic Layer** — Express.js backend (APIs, auth, validation)
3. **Database Layer** — MongoDB (users, foods, categories, orders)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mrmushtaq/delishdrop.git
cd delishdrop
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

Seed the admin account (run once only):

```bash
node scripts/seedAdmin.js
```

Start the backend server:

```bash
npm run dev
```

> Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend dev server:

```bash
npm run dev
```

> Frontend runs on: `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `mysecretkey123` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new customer |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get current logged-in user |

### Food
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/foods` | Get all food items |
| POST | `/api/foods` | Add a new food item (Admin) |
| PUT | `/api/foods/:id` | Update full food record (Admin) |
| PATCH | `/api/foods/:id` | Update partial food record (Admin) |
| DELETE | `/api/foods/:id` | Delete a food item (Admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders` | Get all orders (Admin) |
| GET | `/api/orders/:id` | Get a specific order |
| PATCH | `/api/orders/:id` | Update order status (Admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | All registered customers |
| GET | `/api/admin/foods` | All food items (admin view) |
| GET | `/api/admin/orders` | All orders (admin view) |

---

## 🗄️ Database Collections

| Collection | Description |
|------------|-------------|
| `users` | Customer and admin accounts |
| `foods` | Restaurant menu items |
| `categories` | Food categories |
| `orders` | Customer orders and status history |

---

## 📁 Folder Structure

```
delishdrop/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level components
│   │   ├── context/          # Context API providers
│   │   ├── services/         # Axios API service calls
│   │   └── main.jsx
│   ├── .env
│   └── vite.config.js
│
├── backend/
│   ├── controllers/          # Route handler logic
│   ├── models/               # Mongoose schema models
│   ├── routes/               # Express route definitions
│   ├── middleware/           # Auth & validation middleware
│   ├── scripts/              # Seed scripts (seedAdmin.js)
│   ├── .env
│   └── server.js
│
├── Output Screenshots/       # App screenshots
└── README.md
```

---

## 🔒 Security

- JWT token-based authentication with expiry
- Protected API routes with middleware guard
- Role-based authorization: customer vs admin
- Password encryption using bcrypt
- Admin account created only via `seedAdmin.js` — no public admin registration
- Input validation on all write routes
- Proper error handling with meaningful HTTP status codes

---

## 📜 Available Scripts

### Backend
```bash
npm run dev          # Start with nodemon (hot reload)
npm start            # Start in production mode
node scripts/seedAdmin.js  # Seed initial admin account
```

### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 👤 Author

| | |
|---|---|
| **Name** | Mushtaque Ali |
| **Roll No** | 023-23-0165 |
| **University** | Sukkur IBA University (SIBAU) |
| **GitHub** | [github.com/mrmushtaq](https://github.com/mrmushtaq) |

---

*Built with ❤️ using the MERN Stack*
