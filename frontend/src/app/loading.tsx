import { ProductSliderSkeleton } from '@/components/ui/Skeleton';
import { Truck, Recycle, Star } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-marble-white/30">
      
      {/* Trust Badges Skeleton - Static content effectively */}
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

      {/* Product Slider Skeletons imitating the homepage sections */}
      <ProductSliderSkeleton />
      <ProductSliderSkeleton />
      <ProductSliderSkeleton />
      <ProductSliderSkeleton />

    </div>
  );
}
