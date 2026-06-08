import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { register } from "../services/api";


/* ─── Reusable Field ───────────────────────────────────────────── */
const Field = ({
  name,
  label,
  type = "text",
  icon: Icon,
  right,
  value,
  onChange,
  error,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
      {label}
    </label>
    <div className="relative">
      <Icon
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className={`
          w-full pl-10 pr-10 py-3 text-sm rounded-2xl border-2 bg-gray-50
          outline-none transition-all duration-200
          placeholder:text-gray-300 text-gray-800
          ${error
            ? "border-red-300 bg-red-50 focus:border-red-400"
            : "border-transparent focus:border-green-500 focus:bg-white"
          }
        `}
      />
      {right && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
          {right}
        </span>
      )}
    </div>
    {error && (
      <p className="text-red-400 text-xs font-medium pl-1">{error}</p>
    )}
  </div>
);


/* ─── Signup Page ──────────────────────────────────────────────── */
const Signup = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors]   = useState({});
  const [apiErr, setApiErr]   = useState("");
  const [success, setSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);


  const validate = () => {
    const e = {};
    if (!form.name.trim())                          e.name     = "Name required";
    if (!form.email.trim())                         e.email    = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))   e.email    = "Enter a valid email";
    if (!form.phone.trim())                         e.phone    = "Phone required";
    if (!form.address.trim())                       e.address  = "Address required";
    if (form.password.length < 6)                   e.password = "Minimum 6 characters";
    if (form.password !== form.confirm)             e.confirm  = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const check = validate();
    if (Object.keys(check).length) { setErrors(check); return; }

    try {
      setLoading(true);
      const { data } = await register({
        name:     form.name,
        email:    form.email,
        phone:    form.phone,
        address:  form.address,
        password: form.password,
        // role is intentionally NOT sent
      });

      const userData = data?.data?.user;
      const token    = data?.data?.token;

      loginUser(userData, token);
      setSuccess("Account created! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 800);

    } catch (error) {
      setApiErr(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  /* ─── Render ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f5f5f0" }}>

      {/* ── Left Brand Panel ───────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden"
        style={{ backgroundColor: "#1a4731" }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10"
          style={{ backgroundColor: "#4ade80" }}
        />
        <div
          className="absolute bottom-10 -right-16 w-96 h-96 rounded-full opacity-[0.07]"
          style={{ backgroundColor: "#4ade80" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-[0.06]"
          style={{ backgroundColor: "#fff" }}
        />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-10">
          <span className="text-2xl">🍃</span>
          <span className="text-white text-xl font-black tracking-tight">DelishDrop</span>
        </Link>

        {/* Center copy */}
        <div className="z-10">
          <h2 className="text-white text-4xl font-black leading-tight mb-4">
            Good food,<br />
            <span style={{ color: "#86efac" }}>delivered fast.</span>
          </h2>
          <p className="text-green-200 text-sm leading-relaxed max-w-xs">
            Join thousands of happy customers who order their favourite meals with just a tap.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 mt-8">
            {[
              { icon: "🚀", text: "Fast delivery to your door" },
              { icon: "🍔", text: "100+ restaurants in your city" },
              { icon: "💳", text: "Secure & easy payments" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: "rgba(134,239,172,0.15)" }}
                >
                  {icon}
                </span>
                <span className="text-green-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom link */}
        <p className="text-green-400 text-xs z-10">
          © {new Date().getFullYear()} DelishDrop. All rights reserved.
        </p>
      </div>


      {/* ── Right Form Panel ───────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-xl">🍃</span>
            <span className="text-green-800 text-lg font-black">DelishDrop</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Create account
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Already have one?{" "}
              <Link to="/login" className="text-green-700 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* API error */}
          {apiErr && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-2xl mb-5">
              <span className="mt-0.5">⚠️</span>
              <span>{apiErr}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-2xl mb-5">
              <span>✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* ── Form ─────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Row: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                name="name"
                label="Full Name"
                icon={FiUser}
                value={form.name}
                onChange={handleChange}
                error={errors.name}
              />
              <Field
                name="email"
                label="Email"
                icon={FiMail}
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            {/* Row: Phone + Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                name="phone"
                label="Phone"
                icon={FiPhone}
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <Field
                name="address"
                label="Address"
                icon={FiMapPin}
                value={form.address}
                onChange={handleChange}
                error={errors.address}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">Security</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Row: Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                name="password"
                label="Password"
                type={showPwd ? "text" : "password"}
                icon={FiLock}
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                }
              />
              <Field
                name="confirm"
                label="Confirm Password"
                type={showPwd ? "text" : "password"}
                icon={FiLock}
                value={form.confirm}
                onChange={handleChange}
                error={errors.confirm}
              />
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className="
                mt-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white
                flex items-center justify-center gap-2
                transition-all duration-200 active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed
              "
              style={{ backgroundColor: loading ? "#4ade80" : "#15803d" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <FiArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          {/* Terms note */}
          <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
            By signing up you agree to our{" "}
            <span className="text-gray-500 underline cursor-pointer">Terms of Service</span>{" "}
            and{" "}
            <span className="text-gray-500 underline cursor-pointer">Privacy Policy</span>.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;