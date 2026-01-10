import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/components/ui/Button'; // reusing cn

interface CategoryCardProps {
  title: string;
  slug: string;
  count?: number;
  className?: string;
}

export function CategoryCard({ title, slug, count, className }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className={cn(
        "group flex flex-col justify-between rounded-xl border border-stone-grey/20 bg-white p-6 shadow-sm transition-all hover:border-aegean-blue/50 hover:shadow-md",
        className
      )}
    >
      <div>
        <h3 className="font-serif-heading text-xl font-medium text-charcoal-ink group-hover:text-aegean-blue transition-colors">
          {title}
        </h3>
        {count !== undefined && (
          <p className="mt-1 text-sm text-stone-grey">{count} items</p>
        )}
      </div>
      <div className="mt-4 flex items-center text-sm font-medium text-aegean-blue opacity-0 transition-opacity group-hover:opacity-100">
        Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </Link>
  );
}
