import { useState } from 'react';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../../assets/page-1.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // loading state
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');

    // Client-side validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data?.data ?? res.data;

      if (token && user) {
        setAuth(user, token);
        navigate('/pages');
      } else {
        setError('Wrong email or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message;

      if (msg) {
        setError(msg);
      } else if (err.response?.status === 401) {
        setError('Wrong email or password');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-1 justify-center items-center px-6 py-12">
        <div className="bg-white flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full">
          {/* Illustration */}
          <div className="hidden md:flex w-1/2 bg-gray-100 justify-center items-center p-10">
            <img src={heroImage} alt="Workspace illustration" className="rounded-2xl" />
          </div>

          {/* Form */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome Back</h2>

            <label className="block mb-4">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                placeholder="you@example.com"
              />
            </label>

            <label className="block mb-2">
              <span className="text-gray-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                placeholder="********"
              />
            </label>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading} // disable button while loading
              className={`w-full py-3 text-white rounded-lg font-semibold transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-500 hover:bg-brand-600'
              }`}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{' '}
              <Link className="text-brand-600 font-medium hover:underline" to="/signup">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
