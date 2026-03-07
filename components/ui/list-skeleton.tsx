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

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm rounded-xl">
      <Skeleton className="aspect-square w-full rounded-t-xl rounded-b-none" />
      <div className="p-4 pt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="px-4 pb-2">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="flex items-center justify-between px-4 pb-4 pt-3 border-t border-zinc-800">
        <Skeleton className="h-3 w-16" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

function ProductCardGridSkeleton({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
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
  ProductCardSkeleton,
  ProductCardGridSkeleton,
};
