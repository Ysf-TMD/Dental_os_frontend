'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const routeLabels: Record<string, string> = {
  '/': 'Accueil',
  '/dashboard': 'Tableau de bord',
  '/admin': 'Administration',
  '/admin/roles': 'Rôles',
  '/admin/permissions': 'Permissions',
  '/admin/pages': 'Pages',
  '/admin/role-permissions': 'Affectation Rôles/Permissions',
  '/admin/role-pages': 'Affectation Rôles/Pages',
  '/patients': 'Patients',
  '/appointments': 'Rendez-vous',
  '/consultations': 'Consultations',
  '/treatments': 'Traitements',
  '/invoices': 'Factures',
  '/payments': 'Paiements',
  '/settings': 'Paramètres',
};

export function BreadcrumbNav() {
  const pathname = usePathname();
  
  // Generate breadcrumb items from path
  const paths = pathname.split('/').filter(Boolean);
  
  if (paths.length === 0) {
    return null;
  }

  const breadcrumbItems = paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/');
    const label = routeLabels[href] || path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = index === paths.length - 1;

    return { href, label, isLast };
  });

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
