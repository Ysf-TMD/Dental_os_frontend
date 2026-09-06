'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePermissions } from '@/lib/context/permission-context';
import type { Page } from '@/features/rbac/types';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import { NavigationSkeleton } from './navigation-skeleton';

interface NavigationItem {
  id: number;
  name: string;
  display_name: string;
  path: string;
  icon?: string;
  group_name?: string;
}

export function DynamicNavigation() {
  const { getAccessiblePages, loading, accessiblePages } = usePermissions();
  const pathname = usePathname();
  const [groupedPages, setGroupedPages] = useState<Record<string, NavigationItem[]>>({});
  console.log("this is grouped pages " , groupedPages)
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const pages = getAccessiblePages();
    console.log('this is pages fetch ' , pages);
    console.log('Accessible pages:', pages);
    const grouped: Record<string, NavigationItem[]> = {};

    pages.forEach(page => {
      const groupName = page.group_name || 'General';
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push({
        id: page.id,
        name: page.name,
        display_name: page.display_name,
        path: page.path,
        icon: page.icon,
        group_name: page.group_name,
      });
    });

    setGroupedPages(grouped);

    // Open all groups by default
    const initialOpenState: Record<string, boolean> = {};
    Object.keys(grouped).forEach(groupName => {
      initialOpenState[groupName] = true;
    });
    setIsOpen(initialOpenState);
  }, [accessiblePages]);

  const toggleGroup = (groupName: string) => {
    setIsOpen(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  if (loading) {
    return <NavigationSkeleton />;
  }

  return (
    <div className="space-y-5">
      {Object.entries(groupedPages).map(([groupName, items]) => (
        <div key={groupName}>
          <button
            onClick={() => toggleGroup(groupName)}
            className="w-full flex items-center justify-between px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-colors"
          >
            <span>{groupName}</span>
            <ChevronDown className={`size-3.5 transition-transform ${isOpen[groupName] ? 'rotate-180' : ''}`} />
          </button>
          {isOpen[groupName] && (
            <ul className="space-y-0.5">
              {items.map(item => {
                const active = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
                const Icon = item.icon ? (Icons as any)[item.icon] : null;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={[
                        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all",
                        active
                          ? "bg-primary/15 text-primary-foreground font-medium"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      ].join(" ")}
                    >
                      {active && (
                        <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                      )}
                      {Icon && (
                        <Icon
                          className={[
                            "size-[18px] transition-colors",
                            active ? "text-primary" : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground",
                          ].join(" ")}
                          strokeWidth={2}
                        />
                      )}
                      <span>{item.display_name}</span>
                      {item.name === "notifications" && (
                        <Badge className="ml-auto h-5 px-1.5 bg-primary text-primary-foreground text-[10px] border-0">10</Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
