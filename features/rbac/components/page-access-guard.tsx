'use client';

import React from 'react';
import { usePermissions } from '@/lib/context/permission-context';
import { useRouter } from 'next/navigation';

interface PageAccessGuardProps {
  pageName: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PageAccessGuard({ pageName, fallback = null, children }: PageAccessGuardProps) {
  const { getAccessiblePages, loading } = usePermissions();
  const router = useRouter();

  const accessiblePages = getAccessiblePages();
  const hasAccess = accessiblePages.some(page => page.name === pageName);

  if (loading) {
    return null;
  }

  if (!hasAccess) {
    router.push('/unauthorized');
    return null;
  }

  return <>{children}</>;
}
