import { Routes, Route } from "react-router-dom";
import { PrivateRoute, AdminRoute, GuestRoute } from "./ProtectedRoute";

import Home             from "../pages/Home";
import Menu             from "../pages/Menu";
import FoodDetails      from "../pages/FoodDetails";
import Cart             from "../pages/Cart";
import Login            from "../pages/Login";
import Register         from "../pages/Signup";
import About            from "../pages/About";
import Offers           from "../pages/Offers";
import Reviews          from "../pages/Reviews";
import Dashboard        from "../pages/Dashboard";
import AdminDashboard   from "../pages/AdminDashboard";
import OrderConfirmation from "../pages/OrderConfirmation";
import EditProfile      from "../pages/EditProfile";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
    <div className="text-7xl mb-4">🍽️</div>
    <h1 className="text-6xl font-black text-green-700">404</h1>
    <p className="text-xl text-gray-500 mt-2">Page not found</p>
    <a href="/" className="mt-6 px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition">
      Go Home
    </a>
  </div>
);

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/"       element={<Home />} />
    <Route path="/about"  element={<About />} />
    <Route path="/menu"   element={<Menu />} />
    <Route path="/offers" element={<Offers />} />
    <Route path="/food/:id" element={<FoodDetails />} />
    <Route path="/reviews" element={<Reviews />} />

    {/* Guest only */}
    <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
    <Route path="/signup"   element={<GuestRoute><Register /></GuestRoute>} />

    {/* Private */}
    <Route path="/cart"      element={<PrivateRoute><Cart /></PrivateRoute>} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
    <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />

    {/* Admin */}
    <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;