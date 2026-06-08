import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-gray-900 mb-4">About DelishDrop</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're passionate about delivering fresh, delicious meals to your doorstep with speed and care.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            DelishDrop was founded with a simple mission: to bring restaurant-quality meals to everyone, anytime, anywhere.
            We partner with the best local restaurants and carefully prepare each meal to ensure you get the freshest, most delicious food.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every order is packed with care, every delivery is tracked in real-time, and every customer is treated like family.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80"
            alt="Our team"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 bg-gray-50 rounded-2xl">
          <div className="text-4xl font-black text-amber-400 mb-2">50k+</div>
          <h3 className="text-lg font-bold text-gray-900">Happy Customers</h3>
          <p className="text-gray-600 text-sm mt-2">Join thousands enjoying meals with us</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-2xl">
          <div className="text-4xl font-black text-amber-400 mb-2">500+</div>
          <h3 className="text-lg font-bold text-gray-900">Restaurants</h3>
          <p className="text-gray-600 text-sm mt-2">Curated partners for quality meals</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-2xl">
          <div className="text-4xl font-black text-amber-400 mb-2">24/7</div>
          <h3 className="text-lg font-bold text-gray-900">Support</h3>
          <p className="text-gray-600 text-sm mt-2">Always here to help you</p>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default About;
