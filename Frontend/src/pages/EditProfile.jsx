import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiPhone, FiMapPin, FiSave, FiArrowLeft } from "react-icons/fi";
import api from "../services/api";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:    user?.name    || "",
    phone:   user?.phone   || "",
    address: user?.address || "",
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required."); return; }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await api.patch("/auth/profile", {
        name:    form.name.trim(),
        phone:   form.phone.trim(),
        address: form.address.trim(),
      });

      const updated = data?.data?.user;
      if (updated) updateUser(updated);
      else updateUser(form);

      setSuccess("Profile updated successfully! ✅");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-100 transition-all";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fa" }}>
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">

          <Link to="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <FiArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
                style={{ backgroundColor: "var(--color-primary)" }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Edit Profile</h1>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <FiUser size={13} /> Full Name *
                </label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Your full name" className={inputCls} required />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <FiPhone size={13} /> Phone Number
                </label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="e.g. 03001234567" className={inputCls} />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <FiMapPin size={13} /> Delivery Address
                </label>
                <textarea name="address" value={form.address} onChange={handleChange}
                  placeholder="Your default delivery address" rows="3"
                  className={inputCls + " resize-none"} />
              </div>

              {/* Email — read only */}
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-1.5 block">
                  Email (cannot be changed)
                </label>
                <input value={user?.email} disabled
                  className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
                style={{ backgroundColor: "var(--color-primary)" }}>
                <FiSave size={16} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;