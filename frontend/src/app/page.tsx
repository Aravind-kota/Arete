import { Suspense } from 'react';
import { CategoryRail } from '@/components/ui/CategoryRail';
import { Truck, Recycle, Star } from 'lucide-react';
import { CategorySection } from '@/components/home/CategorySection';
import { ProductSliderSkeleton } from '@/components/ui/Skeleton';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-marble-white/30">
      
      {/* Trust Badges - WOB style distinct bar */}
      <div className="bg-white border-b border-stone-grey/10 py-4">
        <div className="container mx-auto px-4 flex justify-between md:justify-center gap-4 md:gap-16 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap text-sm text-charcoal-ink font-medium">
            <Star className="w-4 h-4 text-bronze-gold fill-current" />
            <span>Excellent on Trustpilot</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap text-sm text-charcoal-ink font-medium">
            <Truck className="w-4 h-4 text-aegean-blue" />
            <span>Free Delivery in the UK</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap text-sm text-charcoal-ink font-medium">
             <Recycle className="w-4 h-4 text-olive-accent" />
             <span>100% Recyclable Packaging</span>
          </div>
        </div>
      </div>


      {/* Fiction Books - Streaming */}
      <Suspense fallback={<ProductSliderSkeleton />}>
        <CategorySection 
          title="Fiction Books" 
          categorySlug="new-fiction-books-uk" 
          viewAllLink="/collections/new-fiction-books-uk"
          bgColor="bg-white"
        />
      </Suspense>

      {/* Romance Books - Streaming */}
      <Suspense fallback={<ProductSliderSkeleton />}>
        <CategorySection 
          title="Romance Books" 
          categorySlug="romance-books" 
          viewAllLink="/collections/romance-books"
          bgColor="bg-marble-white"
        />
      </Suspense>

      {/* Biography Books - Streaming */}
      <Suspense fallback={<ProductSliderSkeleton />}>
        <CategorySection 
          title="Biography & True Stories" 
          categorySlug="biography-and-true-story-books" 
          viewAllLink="/collections/biography-and-true-story-books"
          bgColor="bg-white"
        />
      </Suspense>

      {/* Lifestyle & Cooking Books - Streaming */}
      <Suspense fallback={<ProductSliderSkeleton />}>
        <CategorySection 
          title="Lifestyle, Cooking & Leisure" 
          categorySlug="lifestyle-cooking-and-leisure-books" 
          viewAllLink="/collections/lifestyle-cooking-and-leisure-books"
          bgColor="bg-marble-white"
        />
      </Suspense>

      {/* SEO Text Block - Typical for WOB */}
      <section className="py-16 bg-white border-t border-stone-grey/10">
        <div className="container mx-auto px-4 text-center max-w-4xl">
           <h2 className="font-serif-heading text-2xl font-bold text-charcoal-ink mb-4">Why Buy Used Books?</h2>
           <p className="text-stone-grey leading-relaxed">
             Buying used books is not only a cost-effective way to read more, but it's also an environmentally friendly choice. 
             By choosing pre-loved books, you are helping to reduce waste, save water, and lower carbon emissions compared to producing new books.
             At Aretē, we believe every book deserves a second chance to be read and loved.
           </p>
        </div>
      </section>

    </div>
  );
}
