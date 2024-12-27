// app/components/providers/AuthProvider.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}