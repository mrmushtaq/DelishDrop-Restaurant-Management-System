import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const Footer = () => (
  <footer className="text-white pt-16 pb-8 px-4" style={{ backgroundColor: "var(--color-primary-dark, #12321f)" }}>
    <div className="max-w-7xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: "var(--color-amber)" }}
            >
              🍃
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              DelishDrop
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Delivering happiness to your doorstep, one meal at a time. Fresh,
            fast and absolutely delicious.
          </p>
          <div className="flex gap-3">
            {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-amber-400 hover:text-gray-900 transition-all duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-4 text-amber-400">Quick Links</h4>
          <ul className="space-y-2">
            {[["Home", "/"], ["Menu", "/menu"], ["Offers", "/offers"], ["Reviews", "/reviews"], ["About Us", "/about"]].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-white/60 text-sm hover:text-amber-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-bold mb-4 text-amber-400">Categories</h4>
          <ul className="space-y-2">
            {["Burgers & Fries", "Pizza", "Sandwiches", "Desserts", "Salads", "Drinks"].map((cat) => (
              <li key={cat}>
                <Link
                  to={`/menu?category=${encodeURIComponent(cat)}`}
                  className="text-white/60 text-sm hover:text-amber-400 transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-4 text-amber-400">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-white/60 text-sm">
              <FiMapPin size={16} className="mt-0.5 shrink-0 text-amber-400" />
              Sukkur IBA University, Main Campus, Sukkur, Sindh, Pakistan
            </li>
            <li className="flex items-center gap-3 text-white/60 text-sm">
              <FiPhone size={16} className="shrink-0 text-amber-400" />
              +92 3233079098
            </li>
            <li className="flex items-center gap-3 text-white/60 text-sm">
              <FiMail size={16} className="shrink-0 text-amber-400" />
              mrmak771@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-sm">
        <p>© {new Date().getFullYear()} DelishDrop. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;