import { useState } from 'react';
import api from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../../assets/page-1.jpg';
import { useAuthStore } from '../../store/authStore';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  // Client-side validation
  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  // Clear errors when user types
  const handleFieldChange = (field: keyof FieldErrors, value: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError('');
    }

    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  };

  const handleSignup = async () => {
    setGeneralError('');
    setFieldErrors({});

    // Validate before sending
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/auth/signup', { name, email, password });
      const { user, token } = res.data.data ?? res.data;

      if (user && token) {
        setAuth(user, token);
        console.log('✅ Signup successful, user logged in:', user);
        navigate('/pages');
      } else {
        setGeneralError('Signup succeeded but no user/token returned');
      }
    } catch (err: any) {
      console.error('❌ Signup error:', err);

      // Handle backend validation errors
      if (err.response?.data?.errors) {
        // Backend returns field-specific errors
        setFieldErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        const message = err.response.data.message;

        // Map message to specific field
        if (message.toLowerCase().includes('name')) {
          setFieldErrors({ name: message });
        } else if (message.toLowerCase().includes('email')) {
          if (
            message.toLowerCase().includes('already') ||
            message.toLowerCase().includes('exists')
          ) {
            setFieldErrors({ email: 'This email is already registered' });
          } else {
            setFieldErrors({ email: message });
          }
        } else if (message.toLowerCase().includes('password')) {
          setFieldErrors({ password: message });
        } else {
          setGeneralError(message);
        }
      } else {
        setGeneralError('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
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

          {/* Signup Form */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Create Account</h2>

            {/* Name Field */}
            <label className="block mb-4">
              <span className="text-gray-700">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Your Name"
                className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                  fieldErrors.name
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-brand-500 focus:border-brand-500'
                } focus:outline-none focus:ring-2 transition`}
              />
              {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
            </label>

            {/* Email Field */}
            <label className="block mb-4">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="you@example.com"
                className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                  fieldErrors.email
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-brand-500 focus:border-brand-500'
                } focus:outline-none focus:ring-2 transition`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </label>

            {/* Password Field */}
            <label className="block mb-2">
              <span className="text-gray-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                placeholder="********"
                className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                  fieldErrors.password
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-brand-500 focus:border-brand-500'
                } focus:outline-none focus:ring-2 transition`}
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </label>

            {/* General error message */}
            {generalError && <p className="text-red-500 text-sm mb-4">{generalError}</p>}

            <button
              onClick={handleSignup}
              disabled={isLoading}
              className={`w-full py-3 text-white rounded-lg font-semibold transition ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-500 hover:bg-brand-600'
              }`}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>

            <p className="mt-6 text-center text-gray-600">
              Already have an account?{' '}
              <Link className="text-brand-600 font-medium hover:underline" to="/login">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
