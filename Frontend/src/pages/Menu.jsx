import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFoods } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFavourite } from "../context/FavouriteContext";

const Menu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggleFavourite, isFavourite } = useFavourite();

  const [foods,            setFoods]            = useState([]);
  const [search,           setSearch]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading,          setLoading]          = useState(true);
  const [message,          setMessage]          = useState({ text: "", type: "success" });

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const { data } = await getFoods();
        const foodData = data?.data?.foods || data?.foods || data?.data || data || [];
        setFoods(Array.isArray(foodData) ? foodData : []);
      } catch (error) {
        console.error(error);
        notify("Failed to load menu items.", "error");
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  const notify = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "success" }), 2500);
  };

  const categories = useMemo(() => {
    const names = foods.map((f) => f.category?.name || "Food");
    return ["All", ...new Set(names)];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const cat = food.category?.name || "Food";
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        food.name?.toLowerCase().includes(q) ||
        food.description?.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q);
      const matchCat = selectedCategory === "All" || cat === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [foods, search, selectedCategory]);

  const handleAddToCart = (food) => {
    if (!user) {
      notify("Please login first to add items to cart.", "error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    if (user.role === "admin") {
    notify("Admin accounts cannot place orders.", "error");
    return;
  }
    addItem({
      id: food._id, _id: food._id,
      name: food.name, price: food.price,
      image: food.image, category: food.category?.name || "Food",
      quantity: 1,
    });
    notify(`${food.name} added to cart! 🛒`);
  };

  const handleToggleFavourite = (e, food) => {
    e.stopPropagation();
    if (!user) {
      notify("Please login to save favourites.", "error");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }
    toggleFavourite(food._id);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-cream, #f9fafb)" }}>
      <Navbar />

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">Our Full Menu</h1>
          <p className="text-gray-500 mt-2">Browse fresh dishes — tap ❤️ to save your favourites.</p>
        </div>

        {message.text && (
          <div className={`mb-5 p-4 rounded-2xl text-sm font-medium ${
            message.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow p-5 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food, pizza, drinks..."
            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-green-600 text-sm mb-5"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  selectedCategory === cat
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900">Available Food Items</h2>
          <span className="text-sm text-gray-500">Total Items: {filteredFoods.length}</span>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800">No items found</h3>
            <p className="text-gray-500 mt-2">Try another search or category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => {
              const fav = isFavourite(food._id);
              return (
                <div
                  key={food._id}
                  className="bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
                >
                  <div className="relative overflow-hidden h-44">
                    <img
                      src={food.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"}
                      alt={food.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {food.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{food.discount}%
                      </span>
                    )}
                    <button
                      onClick={(e) => handleToggleFavourite(e, food)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95 ${
                        fav ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <FiHeart size={15} fill={fav ? "white" : "none"} />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-green-700 mb-1">
                      {food.category?.name || "Food"}
                    </p>
                    <h3 className="text-lg font-black text-gray-900 line-clamp-1">
                      {food.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 flex-1">
                      {food.description || "Fresh and delicious food item."}
                    </p>

                    {food.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="text-sm font-semibold text-gray-600">{food.rating}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-lg font-black text-gray-900">
                          Rs. {food.price?.toLocaleString()}
                        </span>
                        {/* ✅ Only show strikethrough when discount > 0 */}
                        {food.oldPrice > 0 && food.discount > 0 && (
                          <span className="text-xs text-gray-400 line-through ml-1.5">
                            Rs. {food.oldPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>

                        <button
                          onClick={() => handleAddToCart(food)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                          style={{ backgroundColor: user?.role === "admin" ? "#f59e0b" : "var(--color-primary, #16a34a)" }}
                        >
                          <FiShoppingCart size={14} />
                          {!user ? "Login" : user.role === "admin" ? "Admin" : "Add"}
                        </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Menu;