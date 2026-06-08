import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    items,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
    totalPrice,
  } = useCart();

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [address,  setAddress]  = useState(user?.address || "");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // ✅ Redirect admin away from cart
  useEffect(() => {
    if (user?.role === "admin") navigate("/admin-dashboard", { replace: true });
  }, [user, navigate]);

  const delivery = 0;
  const tax      = totalPrice * 0.08;
  const total    = totalPrice + delivery + tax;

  const getItemId = (item) => item._id || item.id;

  const handleCheckout = async () => {
    if (!user) { navigate("/login"); return; }

    // ✅ Block admin from ordering
    if (user.role === "admin") {
      setError("Admin accounts cannot place orders. Use a customer account.");
      return;
    }

    if (items.length === 0) { setError("Your cart is empty."); return; }

    if (!address.trim()) { setError("Please enter your delivery address."); return; }

    // ✅ Block mock data items
    const hasInvalidItems = items.some(item => {
      const id = item._id || item.id;
      return !id || typeof id === "number" || !/^[a-f\d]{24}$/i.test(String(id));
    });

    if (hasInvalidItems) {
      setError("Some items are from the preview menu. Please add items from the Menu page instead.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: items.map((item) => ({
          food:     getItemId(item),
          quantity: item.quantity,
          price:    Number(item.price),
        })),
        totalAmount:     Math.round(total * 100) / 100,
        paymentMethod:   "COD",
        deliveryAddress: address.trim(),
      };

      const { data } = await api.post("/orders", orderData);
      clearCart();
      // ✅ Go to confirmation page with order data
      navigate("/order-confirmation", {
        state: { order: data?.data?.order }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 pt-20 px-4">
          <div className="text-8xl">🛒</div>
          <h2 className="text-2xl font-black text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500">Looks like you have not added anything yet.</p>
          <Link
            to="/menu"
            className="px-8 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-all"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Browse Menu
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-gray-900">Your Cart</h1>
            <button
              onClick={clearCart}
              className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <FiTrash2 size={14} /> Clear All
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const itemId = getItemId(item);
                return (
                  <div key={itemId} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{item.category || "Food"}</p>
                      <p className="text-sm font-black mt-1" style={{ color: "var(--color-primary)" }}>
                        Rs. {Number(item.price).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => decreaseQty(itemId)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(itemId)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-colors"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-black text-gray-900">
                        Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeItem(itemId)}
                        className="text-gray-300 hover:text-red-400 transition-colors mt-1"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                    ⚠️ {error}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-600 resize-none"
                    rows="3"
                  />
                </div>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax 8%</span>
                    <span>Rs. {tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900 text-base">
                    <span>Total</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs text-yellow-800">
                    💵 Payment Method: Cash on Delivery
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <FiShoppingBag size={18} />
                  {loading ? "Placing Order..." : "Place Order"}
                </button>

                <Link
                  to="/menu"
                  className="block text-center text-sm mt-4 hover:text-green-800 transition-colors"
                  style={{ color: "var(--color-primary)" }}
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;