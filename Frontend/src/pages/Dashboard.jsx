import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavourite } from "../context/FavouriteContext";
import {
  FiHeart, FiShoppingCart, FiPackage, FiUser,
  FiMapPin, FiPhone, FiMail, FiClock, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import api from "../services/api";

const STATUS_CONFIG = {
  placed:    { color: "bg-blue-50 text-blue-600 border-blue-200",    dot: "bg-blue-500",   emoji: "📋", label: "Order Placed" },
  accepted:  { color: "bg-violet-50 text-violet-600 border-violet-200", dot: "bg-violet-500", emoji: "✅", label: "Accepted" },
  preparing: { color: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-500",  emoji: "👨‍🍳", label: "Preparing" },
  ready:     { color: "bg-indigo-50 text-indigo-600 border-indigo-200", dot: "bg-indigo-500", emoji: "📦", label: "Ready" },
  picked:    { color: "bg-orange-50 text-orange-600 border-orange-200", dot: "bg-orange-500", emoji: "🛵", label: "On the Way" },
  delivered: { color: "bg-green-50 text-green-600 border-green-200",  dot: "bg-green-500",  emoji: "🎉", label: "Delivered" },
  cancelled: { color: "bg-red-50 text-red-500 border-red-200",        dot: "bg-red-500",    emoji: "✕",  label: "Cancelled" },
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <div>
            <p className="text-xs text-gray-400 font-medium">
              Order #{order._id?.slice(-8).toUpperCase()}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FiClock size={11} className="text-gray-400" />
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-gray-900 text-lg">
            Rs. {order.totalAmount?.toLocaleString()}
          </p>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border mt-1 ${cfg.color}`}>
            <span>{cfg.emoji}</span> {cfg.label}
          </span>
        </div>
      </div>

      {/* Items preview */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {order.items?.slice(0, 3).map((item, i) => (
              <img key={i}
                src={item.food?.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100"}
                alt={item.food?.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            ))}
            {order.items?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 ml-1">
            {order.items?.map(i => i.food?.name || "Food Item").join(", ").slice(0, 50)}
            {order.items?.map(i => i.food?.name || "").join(", ").length > 50 ? "..." : ""}
          </p>
          <button onClick={() => setExpanded(!expanded)}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
            {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-4 border-t border-gray-50 pt-3 space-y-3">
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
              <p className="text-sm font-black text-gray-900 shrink-0">
                Rs. {(item.quantity * item.price)?.toLocaleString()}
              </p>
            </div>
          ))}

          <div className="bg-gray-50 rounded-xl p-3 mt-2 flex items-start gap-2">
            <FiMapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-600">{order.deliveryAddress}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
            <span className="flex items-center gap-1">
              💳 Cash on Delivery
            </span>
            <span className={`font-semibold ${order.paymentStatus === "received" ? "text-green-600" : "text-amber-600"}`}>
              {order.paymentStatus === "received" ? "✅ Paid" : "⏳ Pending"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggleFavourite } = useFavourite();

  const [orders, setOrders] = useState([]);
  const [favFoods, setFavFoods] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        const list = data?.data?.orders || data?.orders || data?.data || [];
        setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const { data } = await api.get("/favourites");
        const list = data?.data?.favourites || [];
        setFavFoods(list);
      } catch (err) {
        console.error(err);
      } finally {
        setFavLoading(false);
      }
    };
    fetchFavs();
  }, []);

  const handleAddToCart = (food) => {
    addItem({
      id: food._id, _id: food._id,
      name: food.name, price: food.price,
      image: food.image, category: food.category?.name || "Food",
      quantity: 1,
    });
    setMessage(`${food.name} added to cart! 🛒`);
    setTimeout(() => setMessage(""), 2000);
  };

  const deliveredCount = orders.filter(o => o.orderStatus === "delivered").length;
  const totalSpent = orders
    .filter(o => o.orderStatus !== "cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto">

{/* Profile Hero */}
<div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
  {/* Green banner with avatar and name INSIDE */}
  <div className="px-6 py-6 flex items-center justify-between"
    style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }}>
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl border-2 border-white/30 flex items-center justify-center text-white text-2xl font-black bg-white/20 backdrop-blur-sm">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
      <div>
        <h1 className="text-xl font-black text-white">{user?.name}</h1>
        <p className="text-green-200 text-sm mt-0.5">{user?.email}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <Link to="/edit-profile"
        className="px-4 py-2.5 rounded-full text-sm font-bold bg-white/20 text-white hover:bg-white/30 transition-all border border-white/30">
        ✏️ Edit
      </Link>
      <Link to="/menu"
        className="px-5 py-2.5 rounded-full text-sm font-bold bg-white hover:bg-gray-50 transition-all shadow-sm"
        style={{ color: "var(--color-primary)" }}>
        + Order Food
      </Link>
    </div>
  </div>

  <div className="px-6 pb-6 pt-5">
    <h1 className="hidden">{user?.name}</h1>
    <p className="hidden">{user?.email}</p>

            {/* Info row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[
                { icon: <FiUser size={13} />, label: "Role", value: user?.role === "admin" ? "Admin" : "Customer" },
                { icon: <FiPhone size={13} />, label: "Phone", value: user?.phone || "Not set" },
                { icon: <FiMapPin size={13} />, label: "Address", value: user?.address || "Not set" },
                { icon: <FiMail size={13} />, label: "Email", value: user?.email },
              ].map((info, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                    {info.icon} {info.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Orders", value: orders.length, emoji: "📦", color: "bg-blue-50 text-blue-600" },
            { label: "Delivered", value: deliveredCount, emoji: "✅", color: "bg-green-50 text-green-600" },
            { label: "Total Spent", value: `Rs. ${totalSpent.toLocaleString()}`, emoji: "💰", color: "bg-amber-50 text-amber-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mx-auto mb-2 ${stat.color}`}>
                {stat.emoji}
              </div>
              <p className="font-black text-gray-900 text-lg">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Notification */}
        {message && (
          <div className="mb-4 p-3 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: "orders", icon: <FiPackage size={14} />, label: `My Orders`, count: orders.length },
            { key: "favourites", icon: <FiHeart size={14} />, label: `Favourites`, count: favFoods.length },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all border ${
                activeTab === tab.key
                  ? "text-white border-transparent shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
              style={activeTab === tab.key ? { backgroundColor: "var(--color-primary)" } : {}}>
              {tab.icon} {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <>
            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-14 text-center border border-gray-100">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-black text-gray-800">No orders yet</h3>
                <p className="text-gray-400 mt-2 mb-6 text-sm">Place your first order from our menu!</p>
                <Link to="/menu"
                  className="px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-all text-sm"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  Browse Menu →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => <OrderCard key={order._id} order={order} />)}
              </div>
            )}
          </>
        )}

        {/* Favourites Tab */}
        {activeTab === "favourites" && (
          <>
            {favLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse border border-gray-100">
                    <div className="h-44 bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-5 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : favFoods.length === 0 ? (
              <div className="bg-white rounded-3xl p-14 text-center border border-gray-100">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-black text-gray-800">No favourites yet</h3>
                <p className="text-gray-400 mt-2 mb-6 text-sm">Tap ❤️ on any food to save it here!</p>
                <Link to="/menu"
                  className="px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-all text-sm"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  Browse Menu →
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favFoods.map((food) => {
                  if (!food?._id) return null;
                  return (
                    <div key={food._id}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={food.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"}
                          alt={food.name}
                          className="h-full w-full object-cover"
                        />
                        {food.isOffer && food.discount > 0 && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{food.discount}%
                          </span>
                        )}
                        <button onClick={() => toggleFavourite(food._id)}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all">
                          <FiHeart size={15} fill="white" />
                        </button>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <p className="text-xs font-semibold text-green-700 mb-1">{food.category?.name || "Food"}</p>
                        <h3 className="font-black text-gray-900 line-clamp-1">{food.name}</h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 flex-1">{food.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <span className="text-base font-black" style={{ color: "var(--color-primary)" }}>
                              Rs. {food.price?.toLocaleString()}
                            </span>
                            {food.oldPrice > 0 && (
                              <span className="text-xs text-gray-400 line-through ml-1.5">
                                Rs. {food.oldPrice?.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <button onClick={() => handleAddToCart(food)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white text-xs font-semibold hover:opacity-90 transition-all"
                            style={{ backgroundColor: "var(--color-primary)" }}>
                            <FiShoppingCart size={12} /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;