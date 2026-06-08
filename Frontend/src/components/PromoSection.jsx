import { Link } from "react-router-dom";

const promos = [
  {
    id: 1,
    tag: "Irresistibly Tasty Meals",
    title: "MADE FRESH · SERVED HOT",
    discount: "40%",
    bg: "#fef08a",
    textColor: "#1a1a1a",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
    badge: "Up to",
  },
  {
    id: 2,
    tag: "SUPER",
    title: "DELICIOUS PIZZA",
    discount: "50%",
    bg: "var(--color-primary)",
    textColor: "white",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop",
    badge: "Up to",
  },
  {
    id: 3,
    tag: "LIMITED TIME OFFER",
    title: "LOADED BEEF BURGERS",
    discount: "30%",
    bg: "#ef4444",
    textColor: "white",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
    badge: "Up to",
    wide: true,
  },
];

const PromoSection = () => (
  <section id="promo" className="py-16 px-4 max-w-7xl mx-auto">
    <div className="grid md:grid-cols-2 gap-5">
      {/* Left column: first two stacked */}
      <div className="flex flex-col gap-5">
        {promos.slice(0, 2).map((p) => (
          <div
            key={p.id}
            className="relative rounded-3xl overflow-hidden p-6 flex items-center justify-between group cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ backgroundColor: p.bg, color: p.textColor, minHeight: "160px" }}
          >
            <div className="z-10 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{p.tag}</p>
              <h3 className="text-xl font-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                {p.title}
              </h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm font-medium opacity-80">{p.badge}</span>
                <span className="text-4xl font-black" style={{ color: p.id === 1 ? "var(--color-primary)" : "var(--color-amber)" }}>
                  {p.discount}
                </span>
              </div>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: p.id === 1 ? "var(--color-primary)" : "white",
                  color: p.id === 1 ? "white" : "var(--color-primary)",
                }}
              >
                Order Now 🔥
              </Link>
            </div>
            <img
              src={p.image}
              alt={p.title}
              className="absolute right-0 top-0 h-full w-44 object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Right column: wide promo */}
      <div
        className="relative rounded-3xl overflow-hidden p-8 flex flex-col justify-end group cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{ backgroundColor: promos[2].bg, color: promos[2].textColor, minHeight: "340px" }}
      >
        <img
          src={promos[2].image}
          alt={promos[2].title}
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="relative z-10 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">{promos[2].tag}</p>
          <h3 className="text-3xl font-black" style={{ fontFamily: "var(--font-display)" }}>
            {promos[2].title}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-medium opacity-80">{promos[2].badge}</span>
            <span className="text-5xl font-black" style={{ color: "var(--color-amber)" }}>
              {promos[2].discount}
            </span>
          </div>
          <div className="inline-block bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full">
            SPECIAL DISCOUNT
          </div>
          <br />
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full text-sm font-semibold bg-white transition-all hover:scale-105"
            style={{ color: "var(--color-primary)" }}
          >
            Order Now 🔥
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default PromoSection;