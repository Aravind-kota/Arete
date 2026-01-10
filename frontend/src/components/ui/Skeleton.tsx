import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-stone-grey/10',
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-48 snap-start group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-stone-grey/10 p-4">
        {/* Image skeleton */}
        <Skeleton className="w-full aspect-[3/4] mb-4" />
        
        {/* Title skeleton */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        
        {/* Author skeleton */}
        <Skeleton className="h-3 w-1/2 mb-4" />
        
        {/* Price skeleton */}
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

export function ProductSliderSkeleton() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title skeleton */}
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>
        
        {/* Products skeleton */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {[...Array(6)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-stone-grey/10 p-4">
          <Skeleton className="w-full aspect-[3/4] mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-3" />
          <Skeleton className="h-3 w-1/2 mb-4" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div>
          <Skeleton className="w-full aspect-[3/4] rounded-lg" />
        </div>
        
        {/* Details skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-24" />
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
