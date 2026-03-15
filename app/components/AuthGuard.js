'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const isAuthPage = pathname === '/login' || pathname === '/register';

      if (!token && !isAuthPage) {
        window.location.href = '/login';
      } else if (token && isAuthPage) {
        window.location.href = '/';
      } else {
        setIsAuthenticated(!!token || isAuthPage);
        setLoading(false);
      }
    };

    checkAuth();
    
    // Also listen to storage events or custom events
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, [pathname, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a18', color: '#FFD700' }}>
        <p>Loading session...</p>
      </div>
    );
  }

  return children;
}
