import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiClock, FiZap } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavourite } from "../context/FavouriteContext";
import { getFoods } from "../services/api";

const TopPicks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toggleFavourite, isFavourite } = useFavourite();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getFoods();
        const all = data?.data?.foods || data?.foods || data?.data || data || [];
        const sorted = [...all].sort((a, b) => b.rating - a.rating);
        setFoods(sorted.slice(0, 6));
      } catch (err) {
        console.error("TopPicks load failed:", err);
      }
    };
    load();
  }, []);

  const handleAdd = (food) => {
    if (!user) { navigate("/login"); return; }
    addItem({ id: food._id, _id: food._id, name: food.name, price: food.price, image: food.image, quantity: 1 });
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-amber)" }}>
          — Handpicked for You —
        </p>
        <h2 className="text-4xl font-black text-gray-900">Our Top Picks</h2>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          Chef-curated favourites loved by thousands of customers every week.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => {
          const fav = isFavourite(food._id);
          return (
            <div key={food._id} className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 group flex flex-col">
              {/* Image */}
              <div className="relative overflow-hidden h-44">
                <img
                  src={food.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {food.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{food.discount}%
                  </span>
                )}
                <button
                  onClick={() => { if (!user) { navigate("/login"); return; } toggleFavourite(food._id); }}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 ${fav ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
                >
                  <FiHeart size={15} fill={fav ? "white" : "none"} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1 gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-amber)" }}>
                  {food.category?.name || "Food"}
                </span>
                <h3 className="font-bold text-gray-900 line-clamp-1">{food.name}</h3>

                <div className="flex items-center gap-4 text-gray-500 text-xs">
                  <span className="flex items-center gap-1"><FiClock size={12} /> {food.prepTime || "20 min"}</span>
                  <span className="flex items-center gap-1"><FiZap size={12} /> {food.calories || 0} Cal</span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black" style={{ color: "var(--color-primary)" }}>
                      Rs. {food.price?.toLocaleString()}
                    </span>
                    {food.oldPrice > 0 && (
                      <span className="text-xs text-gray-400 line-through">Rs. {food.oldPrice?.toLocaleString()}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAdd(food)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <FiShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopPicks;