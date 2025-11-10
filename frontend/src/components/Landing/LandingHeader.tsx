import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useState, useEffect } from 'react';

export default function LandingHeader() {
  const user = useAuthStore((s) => s.user);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors ${
        scrolled ? 'bg-white/90 shadow-md backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-gray-900">
          FlowBoard
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-2 text-gray-700 font-medium">
          <a href="#features" className="px-3 py-2 rounded-md hover:bg-gray-100 transition">
            Features
          </a>
          <a href="#pricing" className="px-3 py-2 rounded-md hover:bg-gray-100 transition">
            Pricing
          </a>
          <a href="#team" className="px-3 py-2 rounded-md hover:bg-gray-100 transition">
            Team
          </a>
          <a href="#resources" className="px-3 py-2 rounded-md hover:bg-gray-100 transition">
            Resources
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          {user ? (
            <Link
              to="/pages"
              className="px-5 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
