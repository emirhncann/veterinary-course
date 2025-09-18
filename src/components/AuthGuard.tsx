'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useIsAuthenticated } from '@/lib/stores/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requiredRole?: 'student' | 'instructor' | 'admin';
}

export function AuthGuard({ 
  children, 
  fallback,
  redirectTo,
  requiredRole
}: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { loading, user } = useAuth();
  const [hasChecked, setHasChecked] = React.useState(false);

  React.useEffect(() => {
    if (!loading) {
      setHasChecked(true);
      if (!isAuthenticated) {
        const defaultRedirect = requiredRole === 'admin' ? '/admin/login' : '/login';
        router.push(redirectTo || defaultRedirect);
      } else if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate page based on user role
        if (user?.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }
    }
  }, [isAuthenticated, loading, router, redirectTo, requiredRole, user]);

  // Show loading while checking authentication
  if (loading || !hasChecked) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
