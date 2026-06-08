import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { totalItems, clearCart } = useCart();
  const { user, logoutUser }      = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const isHome   = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("#user-dropdown")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    clearCart();
    logoutUser();
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Home",    to: "/"        },
    { label: "About",   to: "/about"   },
    { label: "Menu",    to: "/menu"    },
    { label: "Offers",  to: "/offers"  },
    { label: "Reviews", to: "/reviews" },
  ];

  const isTransparent = isHome && !scrolled;
  const isAdmin = user?.role === "admin";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .nav-link-pill {
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.4rem 0.75rem;
          border-radius: 99px;
          transition: all 0.2s;
        }
        .nav-link-pill::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%; height: 2px;
          background: #f59e0b;
          border-radius: 99px;
          transition: transform 0.25s cubic-bezier(.4,0,.2,1);
        }
        .nav-link-pill:hover::after,
        .nav-link-pill.active::after { transform: translateX(-50%) scaleX(1); }
        .nav-link-pill.active { color: #f59e0b; font-weight: 600; }
        .dropdown-fade { animation: dropFade 0.18s ease; }
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .mobile-slide { animation: mobileSlide 0.25s ease; }
        @keyframes mobileSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-17.5">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>
                <span className="text-white font-bold text-base">🍃</span>
              </div>
              <span className={`font-extrabold text-xl tracking-tight transition-colors ${
                isTransparent ? "text-white" : "text-gray-900"
              }`}>
                Delish<span style={{ color: "#f59e0b" }}>Drop</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to}
                  className={`nav-link-pill ${location.pathname === link.to ? "active" : ""} ${
                    isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">

              {/* ✅ Cart — hidden for admin */}
              {user && !isAdmin && (
                <Link to="/cart"
                  className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                    isTransparent ? "text-white hover:bg-white/15" : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  <FiShoppingCart size={19} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* Desktop user dropdown */}
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <div id="user-dropdown" className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                        isTransparent ? "text-white hover:bg-white/15" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 500 }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                        style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <span className="max-w-22.5 truncate">{user.name?.split(" ")[0]}</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
                        className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="dropdown-fade absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2">
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                              style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
                              Admin
                            </span>
                          )}
                        </div>

                        {isAdmin ? (
                          <Link to="/admin-dashboard" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                            <FiSettings size={15} /> Admin Dashboard
                          </Link>
                        ) : (
                          <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                            <FiUser size={15} /> My Dashboard
                          </Link>
                        )}

                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <FiLogOut size={15} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login"
                      className={`nav-link-pill ${isTransparent ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                      Login
                    </Link>
                    <Link to="/signup"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", fontFamily: "'DM Sans', sans-serif" }}>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button type="button" onClick={() => setMenuOpen(!menuOpen)}
                className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                  isTransparent ? "text-white hover:bg-white/15" : "text-gray-700 hover:bg-gray-100"
                }`}>
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-slide md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-amber-50 text-amber-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{isAdmin ? "Admin" : "Customer"}</p>
                      </div>
                    </div>

                    {isAdmin ? (
                      <Link to="/admin-dashboard"
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <FiSettings size={16} /> Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link to="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <FiUser size={16} /> My Dashboard
                        </Link>
                        <Link to="/cart"
                          className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <FiShoppingCart size={16} /> Cart {totalItems > 0 && `(${totalItems})`}
                        </Link>
                      </>
                    )}

                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                      <FiLogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-2">
                    <Link to="/login"
                      className="text-center py-3 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50">
                      Login
                    </Link>
                    <Link to="/signup"
                      className="text-center py-3 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;