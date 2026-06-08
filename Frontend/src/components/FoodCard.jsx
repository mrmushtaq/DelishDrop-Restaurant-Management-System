import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiClock, FiZap } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    <span className="text-amber-400 text-sm">★</span>
    <span className="text-sm font-semibold text-gray-700">
      {rating.toFixed(1)}
    </span>
  </div>
);

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Mock data — send to real menu
    navigate("/menu");
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {food.discount && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: "#ef4444" }}
          >
            -{food.discount}%
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <StarRating rating={food.rating} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-amber)" }}
          >
            {food.category}
          </span>
          <h3
            className="font-bold text-gray-900 mt-0.5 line-clamp-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Link
              to="/menu"
              className="hover:text-green-800 transition-colors"
            >
              {food.name}
            </Link>
          </h3>
        </div>

        <div className="flex items-center gap-4 text-gray-500 text-xs">
          <span className="flex items-center gap-1">
            <FiClock size={12} /> {food.prepTime}
          </span>
          <span className="flex items-center gap-1">
            <FiZap size={12} /> {food.calories} Cal
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-lg font-black"
              style={{ color: "var(--color-primary)" }}
            >
              Rs. {food.price.toLocaleString()}
            </span>
            {food.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                Rs. {food.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleClick}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
            style={{ backgroundColor: "var(--color-primary)" }}
            title={user ? "Go to Menu" : "Login to Order"}
          >
            <FiPlus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;