import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiCheckCircle, FiPackage, FiMapPin, FiClock } from "react-icons/fi";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!order) { navigate("/"); return; }
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); navigate("/menu"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fa" }}>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-lg">

          {/* Success animation */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <FiCheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-900">Order Placed! 🎉</h1>
            <p className="text-gray-500 mt-2">
              Your order has been received and is being prepared.
            </p>
          </div>

          {/* Order card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400">Order ID</p>
                <p className="font-black text-gray-900">
                  #{order._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <span className="bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
                📋 Order Placed
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.food?.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100"}
                    alt={item.food?.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.food?.name || "Food Item"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.quantity}x × Rs. {item.price?.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-black text-gray-900">
                    Rs. {(item.quantity * item.price)?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiMapPin size={14} className="text-gray-400 shrink-0" />
                <span>{order.deliveryAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiClock size={14} className="text-gray-400" />
                <span>Estimated delivery: 30-45 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiPackage size={14} className="text-gray-400" />
                <span>Payment: Cash on Delivery</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between">
              <span className="font-semibold text-gray-700">Total Amount</span>
              <span className="font-black text-xl" style={{ color: "var(--color-primary)" }}>
                Rs. {order.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Order progress */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-black text-gray-900 mb-4">Order Progress</h3>
            <div className="flex items-center justify-between">
              {[
                { emoji: "📋", label: "Placed", done: true },
                { emoji: "✅", label: "Accepted", done: false },
                { emoji: "👨‍🍳", label: "Preparing", done: false },
                { emoji: "🛵", label: "On Way", done: false },
                { emoji: "🎉", label: "Delivered", done: false },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      step.done ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      {step.emoji}
                    </div>
                    <p className={`text-xs mt-1 font-medium ${
                      step.done ? "text-green-600" : "text-gray-400"
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`h-0.5 w-8 mx-1 mb-4 ${
                      step.done ? "bg-green-300" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
            <div className="flex gap-3">
            <Link to="/menu"
                className="flex-1 py-3 rounded-full text-white font-bold text-center hover:opacity-90 transition-all"
                style={{ backgroundColor: "var(--color-primary)" }}>
                🍔 Order More
            </Link>
            <Link to="/dashboard"
                className="flex-1 py-3 rounded-full font-bold text-center border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                My Orders
            </Link>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
            Redirecting to menu in {countdown}s... • 
            <Link to="/dashboard" className="underline ml-1" style={{ color: "var(--color-primary)" }}>
                View my orders
            </Link>
            </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;