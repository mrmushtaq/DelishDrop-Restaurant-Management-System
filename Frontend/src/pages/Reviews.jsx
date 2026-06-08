import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { reviews } from "../data/mockData";

const Reviews = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-amber)" }}>
          — What They Say —
        </p>
        <h1 className="text-5xl font-black text-gray-900">Customer Reviews</h1>
        <p className="text-xl text-gray-600 mt-4">Hear from our happy customers</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-hover transition-all">
            <div className="flex text-amber-400 text-lg mb-4">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">"{review.comment}"</p>
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-gray-900">{review.name}</p>
                <p className="text-sm text-gray-400">{review.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center p-12 bg-amber-50 rounded-2xl">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Share Your Experience</h2>
        <p className="text-gray-600 mb-6">Have you ordered from DelishDrop? We'd love to hear about your experience!</p>
        <button
          className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Write a Review
        </button>
      </div>
    </section>
    <Footer />
  </div>
);

export default Reviews;
