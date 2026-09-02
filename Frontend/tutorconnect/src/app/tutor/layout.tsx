'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function TutorProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user?.role !== 'TUTOR') {
      router.replace('/guardian/dashboard');
    }
  }, [isHydrated, isAuthenticated, user, router, pathname]);

  if (!isHydrated || !isAuthenticated || user?.role !== 'TUTOR') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Verifying tutor access...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}