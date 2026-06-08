import { Link } from "react-router-dom";

const Hero = () => (
  <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.2),_transparent_45%)]">
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
            Fresh meals, fast delivery
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-6xl">
              Delicious food delivered to your door.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Enjoy mouthwatering dishes from our curated menu of burgers, pizza, salads, and desserts.
              Order now and get the best offers for your next meal.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-8 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-amber-400/30 transition hover:bg-amber-500"
            >
              Explore Menu
            </Link>
            <Link
              to="/offers"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              View Offers
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] bg-white/90 p-6 shadow-2xl shadow-gray-300/20 ring-1 ring-amber-100">
            <img
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80"
              alt="Delicious food"
              className="h-96 w-full rounded-[1.75rem] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
