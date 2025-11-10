import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import PageList from '../features/pages/PageList';
import LoginPage from '../features/auth/LoginPage';
import { useAuthStore } from '../store/authStore';
import NewPage from '../features/pages/NewPage';
import SignupPage from '../features/auth/SignupPage';
import MainDashboard from '../features/pages/MainDashboard';
import LandingPage from '../components/Landing/LandingPage';
import PageDetails from '../features/pages/PageDetails';

// Protected routes wrapper
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  console.log('🛡️ RequireAuth check:');
  console.log('   Token:', token);
  console.log('   User:', user);

  if (!token) {
    console.log('❌ No token found - redirecting to /login');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Token present - access granted');
  return <>{children}</>;
}

// Home page wrapper
function HomeWrapper() {
  const user = useAuthStore((s) => s.user);
  console.log('🏠 HomeWrapper: user =', user);
  return user ? <MainDashboard /> : <LandingPage />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomeWrapper /> },
      {
        path: '/pages',
        element: (
          <RequireAuth>
            <PageList />
          </RequireAuth>
        ),
      },
      {
        path: '/pages/:id',
        element: (
          <RequireAuth>
            <PageDetails />
          </RequireAuth>
        ),
      },
      {
        path: '/page/new',
        element: (
          <RequireAuth>
            <NewPage />
          </RequireAuth>
        ),
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
]);
