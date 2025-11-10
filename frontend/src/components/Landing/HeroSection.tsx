import { Link } from 'react-router-dom';
import heroImage from '../../assets/page-1.jpg';

export default function HeroSection() {
  return (
    <section className="relative mt-16 flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 md:py-32">
      <div className="md:w-1/2 text-center md:text-left space-y-6 mr-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          FlowBoard
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto md:mx-0">
          Your simple, flexible workspace for ideas, notes, and collaboration. Stay organized and
          work together — effortlessly.
        </p>

        <div className="flex justify-center md:justify-start gap-4 mt-6">
          <Link
            to="/signup"
            className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 shadow-lg transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-brand-500 text-brand-500 rounded-lg hover:bg-brand-50 transition"
          >
            Log In
          </Link>
        </div>
      </div>

      <div className="md:w-1/2 mb-12 md:mb-0 flex justify-center">
        <img
          src={heroImage}
          alt="FlowBoard workspace preview"
          className="w-full max-w-md rounded-2xl shadow-xl"
        />
      </div>
    </section>
  );
}
