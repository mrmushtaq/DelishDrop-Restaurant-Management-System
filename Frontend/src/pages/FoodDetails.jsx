import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiZap, FiShoppingCart } from "react-icons/fi";
import Navbar   from "../components/Navbar";
import Footer   from "../components/Footer";
import FoodCard from "../components/FoodCard";
import { foods } from "../data/mockData";
import { useCart } from "../context/CartContext";

const FoodDetails = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addItem, items } = useCart();
  const food         = foods.find((f) => f.id === Number(id));
  const related      = foods.filter((f) => f.category === food?.category && f.id !== food?.id).slice(0, 3);
  const inCart       = items.find((i) => i.id === food?.id);

  if (!food) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-2xl">🍽️</p>
      <p className="font-semibold text-gray-600">Item not found.</p>
      <button onClick={() => navigate("/menu")} className="text-green-700 underline text-sm">
        Back to Menu
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
          >
            <FiArrowLeft size={16} /> Back
          </button>

          <div className="grid md:grid-cols-2 gap-10 bg-white rounded-3xl overflow-hidden shadow-card">
            {/* Image */}
            <div className="h-64 md:h-full min-h-64 relative">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              {food.discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{food.discount}%
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-amber)" }}>
                {food.category}
              </span>
              <h1 className="text-3xl font-black text-gray-900">{food.name}</h1>
              <p className="text-gray-500 leading-relaxed">{food.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><FiClock size={14} /> {food.prepTime}</span>
                <span className="flex items-center gap-1.5"><FiZap size={14} /> {food.calories} Cal</span>
                <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                  ★ {food.rating.toFixed(1)}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-4xl font-black" style={{ color: "var(--color-primary)" }}>
                  ${food.price.toFixed(2)}
                </span>
                {food.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">${food.originalPrice.toFixed(2)}</span>
                )}
                {food.discount && (
                  <span className="text-sm font-bold text-red-500">{food.discount}% OFF</span>
                )}
              </div>

              <button
                onClick={() => addItem(food)}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95 mt-4"
                style={{ backgroundColor: inCart ? "var(--color-amber)" : "var(--color-primary)" }}
              >
                <FiShoppingCart size={18} />
                {inCart ? `In Cart (${inCart.quantity})` : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-black text-gray-900 mb-6">You might also like</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((f) => <FoodCard key={f.id} food={f} />)}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FoodDetails;