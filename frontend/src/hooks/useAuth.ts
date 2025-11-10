import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

// Custom hook to persist user authentication state from localStorage
export function useAuthPersist() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 useAuthPersist: Starting validation');

    const token = localStorage.getItem('flow_token');
    const user = localStorage.getItem('flow_user');

    console.log('🔍 Token from localStorage:', token);
    console.log('🔍 User from localStorage:', user);

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('✅ Auth recovered:', parsedUser);
        setAuth(parsedUser, token);
      } catch (error) {
        console.error('❌ Failed to parse user from localStorage:', error);
        localStorage.removeItem('flow_token');
        localStorage.removeItem('flow_user');
      }
    } else {
      console.log('⚠️ No token or user found in localStorage');
    }

    setLoading(false);
    console.log('✅ useAuthPersist: Finished');
  }, [setAuth]);

  return isLoading;
}
