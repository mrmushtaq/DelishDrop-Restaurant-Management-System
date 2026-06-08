import { useNavigate } from "react-router-dom";
import { categories } from "../data/mockData";

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4" style={{ backgroundColor: "#eef7ee" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-amber)" }}>
              — All Categories —
            </p>
            <h2 className="text-4xl font-black text-gray-900">
              Explore Delicious Cuisine<br />by Category
            </h2>
          </div>
          <p className="text-gray-500 max-w-xs">
            Our mission is to connect food lovers with their favourite cuisines.
            Whether you're craving a quick bite or culinary adventures.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/menu?category=${encodeURIComponent(cat.name)}`)}
              className="bg-white rounded-2xl p-5 text-center shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-800 leading-tight">{cat.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/menu")}
            className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;