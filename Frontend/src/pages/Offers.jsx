import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFoods } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Offers = () => {
  const [foods,   setFoods]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState({ text: "", type: "success" });

  const { addItem } = useCart();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getFoods();
        const list = data?.data?.foods || data?.foods || data?.data || [];
        setFoods(list.filter((item) => item.isOffer === true));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const notify = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "success" }), 2000);
  };

  const addCart = (food) => {
    // Not logged in
    if (!user) {
      notify("Please login first to order.", "error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    // ✅ Block admin from adding to cart
    if (user.role === "admin") {
      notify("Admin accounts cannot place orders.", "error");
      return;
    }

    addItem({
      id:       food._id,
      _id:      food._id,
      name:     food.name,
      price:    food.price,
      image:    food.image,
      category: food.category?.name,
      quantity: 1,
    });
    notify(`${food.name} added to cart! 🛒`);
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-cream, #f9fafb)" }}>
      <Navbar />

      <main className="pt-24 pb-16 px-5 max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-2">Special Offers 🔥</h1>
        <p className="text-gray-500 mb-8">Today's discounted meals</p>

        {msg.text && (
          <div className={`p-3 rounded-xl mb-5 text-sm font-medium border ${
            msg.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}>
            {msg.text}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-gray-800">No offers available right now</h3>
            <p className="text-gray-500 mt-2">Check back soon for exciting deals!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <div
                key={food._id}
                className="bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative">
                  <img
                    src={food.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"}
                    alt={food.name}
                    className="h-44 w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    -{food.discount}%
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs font-semibold text-green-700 mb-1">
                    {food.category?.name || "Food"}
                  </p>
                  <h2 className="text-lg font-black text-gray-900">{food.name}</h2>
                  <p className="text-gray-500 text-sm mt-1 flex-1">{food.description}</p>

                  <div className="flex gap-3 items-center mt-3">
                    <span className="font-bold text-xl" style={{ color: "var(--color-primary)" }}>
                      Rs. {food.price?.toLocaleString()}
                    </span>
                    {food.oldPrice > 0 && food.discount > 0 && (
                      <span className="line-through text-gray-400 text-sm">
                        Rs. {food.oldPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* ✅ Hide cart button for admin, show manage link instead */}
                  {isAdmin ? (
                    <button
                      onClick={() => navigate("/admin-dashboard")}
                      className="mt-4 w-full py-2 rounded-full text-white font-semibold transition-all hover:opacity-90 bg-amber-500"
                    >
                      Manage in Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => addCart(food)}
                      className="mt-4 w-full py-2 rounded-full text-white font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {user ? "Add to Cart" : "Login to Order"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Offers;