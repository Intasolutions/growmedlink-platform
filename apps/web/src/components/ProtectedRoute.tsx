'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '@intelligen/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (roles && !roles.includes(user.role)) {
        router.push('/admin/unauthorized');
      }
    }
  }, [user, loading, router, roles]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#020C1B]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-secondary animate-spin" />
          <div className="absolute inset-2 rounded-full border-l-2 border-r-2 border-accent animate-spin-reverse" />
        </div>
        <p className="mt-4 text-gray-300 text-sm font-medium tracking-wide animate-pulse">
          Securing session...
        </p>
      </div>
    );
  }

  // Avoid visual flashes during redirect transitions
  if (!user || (roles && !roles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
