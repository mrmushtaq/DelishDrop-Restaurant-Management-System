import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { reviews } from "../data/mockData";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showReview, setShowReview] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [reviewForm, setReviewForm] = useState({
    name: user?.name || "",
    comment: "",
    rating: 5,
  });

  const handleSubmit = () => {
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      alert("Please fill name and review.");
      return;
    }

    setSuccessMsg("Review submitted successfully. Thank you for sharing your experience!");
    setShowReview(false);

    setReviewForm({
      name: user?.name || "",
      comment: "",
      rating: 5,
    });

    setTimeout(() => {
      setSuccessMsg("");
    }, 4000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--color-amber)" }}
          >
            — What They Say —
          </p>

          <h1 className="text-5xl font-black text-gray-900">
            Customer Reviews
          </h1>

          <p className="text-xl text-gray-600 mt-4">
            Hear from our happy customers
          </p>
        </div>

        {successMsg && (
          <div className="mb-8 p-4 rounded-xl bg-green-50 border border-green-300 text-green-700 text-center font-semibold">
            {successMsg}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-8 shadow-card hover:shadow-hover transition-all"
            >
              <div className="flex text-amber-400 text-lg mb-4">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-400">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center p-12 bg-amber-50 rounded-2xl">
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Share Your Experience
          </h2>

          <p className="text-gray-600 mb-6">
            Have you ordered from DelishDrop? We'd love to hear about your experience!
          </p>

          <button
            onClick={() => {
              if (!user) {
                alert("Please login first to write a review.");
                navigate("/login");
                return;
              }

              setReviewForm((prev) => ({
                ...prev,
                name: user?.name || "",
              }));

              setShowReview(true);
            }}
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Write a Review
          </button>
        </div>

        {showReview && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Write a Review
              </h2>

              <input
                type="text"
                placeholder="Your Name"
                value={reviewForm.name}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3 mb-3"
              />

              <textarea
                placeholder="Your Review"
                rows="4"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    comment: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3 mb-3"
              />

              <select
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    rating: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-3 mb-5"
              >
                <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                <option value={4}>⭐⭐⭐⭐ Good</option>
                <option value={3}>⭐⭐⭐ Average</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-700 text-white py-2 rounded-lg"
                >
                  Submit
                </button>

                <button
                  onClick={() => setShowReview(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Reviews;