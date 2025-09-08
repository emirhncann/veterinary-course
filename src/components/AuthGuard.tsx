'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useIsAuthenticated } from '@/lib/stores/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/login' 
}: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { loading } = useAuth();
  const [hasChecked, setHasChecked] = React.useState(false);

  React.useEffect(() => {
    if (!loading) {
      setHasChecked(true);
      if (!isAuthenticated) {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, loading, router, redirectTo]);

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

  return <>{children}</>;
}
