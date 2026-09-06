'use client';

import {Skeleton} from "@/components/ui/skeleton";

export function NavigationSkeleton() {
  return (
    <Skeleton className="space-y-5 px-3 py-4">
      {[1, 2, 3].map((group) => (
        <div key={group}>
          <div className="h-4 w-24 bg-sidebar-accent/30 rounded mb-2 animate-pulse" />
          <ul className="space-y-0.5">
            {[1, 2, 3].map((item) => (
              <li key={item}>
                <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
                  <div className="size-[18px] bg-sidebar-accent/30 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-sidebar-accent/30 rounded animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Skeleton>
  );
}
