import Navbar          from "../components/Navbar";
import Hero            from "../components/Hero";
import PromoSection    from "../components/PromoSection";
import TopPicks        from "../components/TopPicks";
import CategorySection from "../components/CategorySection";
import DealsSection    from "../components/DealsSection";
import Footer          from "../components/Footer";
import { reviews }     from "../data/mockData";

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-2xl p-6 shadow-card flex flex-col gap-4">
    <div className="flex text-amber-400 text-sm">
      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
    </div>
    <p className="text-gray-600 text-sm leading-relaxed">"{review.comment}"</p>
    <div className="flex items-center gap-3 mt-auto">
      <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <p className="text-sm font-bold text-gray-900">{review.name}</p>
        <p className="text-xs text-gray-400">{review.date}</p>
      </div>
    </div>
  </div>
);

const Home = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <PromoSection />
    <TopPicks />
    <CategorySection />
    <DealsSection />

    <section className="py-16 px-4" style={{ backgroundColor: "var(--color-cream-dark)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-amber)" }}>
            — What They Say —
          </p>
          <h2 className="text-4xl font-black text-gray-900">Customer Reviews</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Home;