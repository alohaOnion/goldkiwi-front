"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface ListItemSkeletonProps {
  hasIcon?: boolean;
  lines?: number;
}

function ListItemSkeleton({ hasIcon = true, lines = 2 }: ListItemSkeletonProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-800 last:border-0">
      {hasIcon && (
        <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
      )}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-24" />
        {lines > 1 && <Skeleton className="h-3 w-16" />}
      </div>
    </div>
  );
}

interface ListSkeletonProps {
  count?: number;
  hasIcon?: boolean;
  lines?: number;
}

function ListSkeleton({ count = 3, hasIcon = true, lines = 2 }: ListSkeletonProps) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <ListItemSkeleton key={i} hasIcon={hasIcon} lines={lines} />
      ))}
    </div>
  );
}

function HistoryListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-800 last:border-0">
      <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

function HistoryListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <HistoryListItemSkeleton key={i} />
      ))}
    </div>
  );
}

function CardListSkeleton({ itemCount = 5 }: { itemCount?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-4 border-b border-zinc-800 last:border-0"
        >
          <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export {
  ListSkeleton,
  ListItemSkeleton,
  HistoryListSkeleton,
  HistoryListItemSkeleton,
  CardListSkeleton,
};
