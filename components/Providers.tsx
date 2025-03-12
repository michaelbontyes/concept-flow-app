'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <div className="contents">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
} 