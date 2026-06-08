import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/api";

const InputField = ({ name, label, type = "text", icon: Icon, right, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={label}
        className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-colors ${
          error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-green-600"
        }`}
      />
      {right && <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{right}</span>}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  // ✅ Remember where user came from
  const from = location.state?.from || null;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Minimum 6 characters.";
    return e;
  };

  const redirectByRole = (role) => {
    if (role === "admin") { navigate("/admin-dashboard"); return; }
    if (role === "restaurant_owner") { navigate("/restaurant-dashboard"); return; }
    if (role === "delivery_rider") { navigate("/delivery-dashboard"); return; }
    // ✅ Go back to previous page or dashboard
    navigate(from || "/dashboard");
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    setApiErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiErr("");
    setSuccess("");

    try {
      const { data } = await login({ email: form.email.trim(), password: form.password });
      const userData = data?.data?.user;
      const token = data?.data?.token;
      if (!userData || !token) throw new Error("Invalid server response.");

      loginUser(userData, token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => redirectByRole(userData.role), 800);
    } catch (err) {
      setApiErr(err.response?.data?.message || err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--color-cream)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden"
        style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{
              width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
              border: "2px solid white", top: `${10 + i * 12}%`, left: `${5 + i * 10}%`,
            }} />
          ))}
        </div>
        <div className="relative text-white text-center">
          <div className="text-6xl mb-6">🍔</div>
          <h2 className="text-4xl font-black mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Welcome Back!
          </h2>
          <p className="text-white/70 max-w-xs">
            Sign in to continue your delicious journey with DelishDrop.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[["500+", "Menu Items"], ["4.9★", "Rating"], ["30min", "Delivery"]].map(([v, l]) => (
              <div key={l} className="bg-white/10 rounded-2xl p-3">
                <p className="font-black text-lg">{v}</p>
                <p className="text-white/60 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-amber)" }}>🍃</div>
              <span className="font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                DelishDrop
              </span>
            </Link>
            <h1 className="text-3xl font-black text-gray-900">Sign In</h1>
            <p className="text-gray-500 mt-1 text-sm">Enter your credentials to continue.</p>
          </div>

          {apiErr && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {apiErr}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField name="email" label="Email Address" icon={FiMail}
              value={form.email} onChange={handleChange} error={errors.email} />
            <InputField name="password" label="Password"
              type={showPwd ? "text" : "password"} icon={FiLock}
              value={form.password} onChange={handleChange} error={errors.password}
              right={
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="text-gray-400 hover:text-gray-600">
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              }
            />
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--color-primary)" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Admin hint */}
          <div className="mt-4 p-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-xs text-gray-400 text-center">
            Admin: admin@delishdrop.com / Admin@123456
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold hover:underline"
              style={{ color: "var(--color-primary)" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;