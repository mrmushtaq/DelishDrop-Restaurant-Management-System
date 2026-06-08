# DelishDrop MERN Stack Upgrade - Setup Guide

## Overview
DelishDrop has been upgraded to a full-featured food delivery platform with role-based access, real-time Socket.IO updates, security hardening, and a multi-role system supporting customers, restaurant owners, delivery riders, and admins.

## Backend Setup

### 1. Environment Variables (.env)

Create a `.env` file in the `backend/` directory with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/delishdrop
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/delishdrop

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

The following security packages have been installed:
- `helmet` - HTTP security headers
- `express-rate-limit` - API rate limiting
- `express-mongo-sanitize` - MongoDB injection prevention
- `xss-clean` - XSS attack prevention
- `socket.io` - Real-time WebSocket communication

### 3. Start Backend Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

Socket.IO client has been added for real-time notifications.

### 2. Environment Variables (.env)

Create a `.env.local` file in the `frontend/` directory (optional - defaults work if backend is on localhost:5000):

```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Frontend Dev Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## Database Setup (MongoDB)

### Local MongoDB

1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB

   # macOS (homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```
3. Set `MONGODB_URI=mongodb://localhost:27017/delishdrop` in `.env`

### MongoDB Atlas (Cloud)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a cluster and database
3. Get connection string and add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/delishdrop?retryWrites=true&w=majority
   ```

---

## User Roles & Features

### 1. **Customer (user)**
- Browse food items
- Add to cart
- Place COD orders
- View order status
- Track delivery in real-time

**Register as:** Choose "Customer" during signup

### 2. **Restaurant Owner (restaurant_owner)**
- Create and manage food items
- Enable/disable food availability
- View orders placed for their restaurant
- Update order preparation status (placed → accepted → preparing → ready)
- Real-time order notifications

**Register as:** Choose "Restaurant Owner" during signup

### 3. **Delivery Rider (delivery_rider)**
- View available deliveries (orders marked as "ready")
- Accept deliveries
- Update delivery progress
- Mark orders as delivered
- Real-time delivery updates

**Create via:** Database or admin panel (test mode: manually assign role)

### 4. **Admin**
- View platform analytics
- Manage users, restaurants, foods, and orders
- Override any operation
- Access admin dashboard at `/api/admin/stats`

**Create via:** Database or set `role: "admin"` manually

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (with role, phone, address)
- `POST /api/auth/login` - Login (with rate limiting)
- `GET /api/auth/me` - Get current user profile

### Foods (Public)
- `GET /api/foods` - List all available foods (with search, filter, sort)
- `GET /api/foods/:id` - Get single food item

### Foods (Restaurant Owner Only)
- `POST /api/foods` - Create new food item
- `PUT /api/foods/:id` - Update food (full)
- `PATCH /api/foods/:id` - Update food (partial)
- `PATCH /api/foods/:id/availability` - Toggle availability
- `DELETE /api/foods/:id` - Delete food item

### Orders
- `POST /api/orders` - Create COD order
- `GET /api/orders` - Get user/restaurant/admin orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id` - Update order status (restaurant owner only)
- `DELETE /api/orders/:id` - Delete order (admin only)

### Delivery
- `GET /api/delivery/orders` - Get available deliveries (rider only)
- `PATCH /api/delivery/orders/:id/accept` - Accept delivery (rider only)
- `PATCH /api/delivery/orders/:id/status` - Update delivery status (rider only)

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/restaurants` - List restaurants
- `GET /api/admin/foods` - List all foods
- `GET /api/admin/orders` - List all orders

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin only)
- `PATCH /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

---

## Real-Time Socket Events

### Client → Server
- `join { room }` - Join a notification room
- `leave { room }` - Leave a room

### Server → Client

**Customer receives:**
- `order_status_updated` - Order status changed
- `delivery_updated` - Delivery rider assigned/progressed

**Restaurant receives:**
- `new_order` - New order placed
- `order_status_updated` - Status changes

**Delivery Rider receives:**
- `delivery_available` - New delivery ready for pickup

---

## Order Status Flow

```
placed (customer creates)
  ↓
accepted (restaurant accepts)
  ↓
preparing (restaurant starts prep)
  ↓
ready (restaurant marks ready)
  ↓
picked (delivery rider accepts and picks up)
  ↓
delivered (rider marks delivered → payment = received)

OR at any point: cancelled
```

---

## Payment System

**Current Implementation:** Cash On Delivery (COD) Only

- Payment Method: `"COD"`
- Payment Status: `"pending"` → `"received"` (when delivered)
- Total includes: Subtotal + Tax (8%) + Delivery (free)

---

## Testing the Platform

### Step 1: Start Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Step 2: Register Test Users

1. **Customer:** Go to `/signup`, choose "Customer"
2. **Restaurant Owner:** Go to `/signup`, choose "Restaurant Owner"
3. **Delivery Rider:** Register as customer, then manually change role in MongoDB to `"delivery_rider"`, or use admin API

### Step 3: Navigate by Role

- **Customer:** `/dashboard` → Browse menu → Add to cart → Checkout with address
- **Restaurant Owner:** `/restaurant-dashboard` → Manage menu and orders
- **Delivery Rider:** `/delivery-dashboard` → Accept orders and deliver
- **Admin:** `/dashboard` (shows role-based panel)

---

## Security Features Implemented

✅ **Helmet** - Secure HTTP headers
✅ **Rate Limiting** - 200 requests per 15 minutes per IP, 10 login attempts per 15 minutes
✅ **MongoDB Sanitization** - Prevents NoSQL injection
✅ **XSS Protection** - Input sanitization
✅ **JWT Authentication** - Secure token-based auth
✅ **Role-Based Access Control** - Authorization middleware
✅ **Password Hashing** - Bcrypt with salt
✅ **Error Handling** - Consistent error responses

---

## Troubleshooting

### Backend won't start
- Check MongoDB connection: `MONGODB_URI` in `.env`
- Ensure Port 5000 is not in use: `lsof -i :5000` (macOS/Linux)
- Check JWT_SECRET is set

### Frontend can't connect to backend
- Verify `http://localhost:5000` is accessible
- Check CORS settings in `backend/app.js`
- Verify backend is running on port 5000

### Socket.IO not connecting
- Ensure backend server is running
- Check browser console for connection errors
- Verify client URL matches frontend URL

### Orders not creating
- Ensure user is logged in
- Check delivery address is provided
- Verify restaurant owner exists for food items
- Check order validation in backend

---

## Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables on platform
2. Ensure MongoDB Atlas connection string is configured
3. Deploy with `npm run start`

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production backend URL
2. Build with `npm run build`
3. Deploy `dist/` folder

---

## Next Steps

1. ✅ Test all user roles
2. ✅ Create admin user via database
3. ✅ Add real food items and categories
4. ✅ Test Socket.IO real-time updates
5. ✅ Set up payment gateway (Stripe, Razorpay) for future phases
6. ✅ Add Google/Facebook OAuth for auth
7. ✅ Implement ratings and reviews
8. ✅ Add restaurant location tracking

---

## Support & Issues

For issues or questions:
1. Check backend logs: `npm run dev` console output
2. Check frontend console: Browser DevTools → Console
3. Check MongoDB connection and data
4. Verify all `.env` variables are set correctly
