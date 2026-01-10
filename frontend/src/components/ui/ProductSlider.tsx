'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  title: string;
  author?: string;
  price: string;
  currency?: string;
  imageUrl?: string;
  sourceId?: string;
  condition?: string;
  specialOffer?: string;
  rating?: number;
  ratingCount?: number;
  year?: string;
}

interface ProductSliderProps {
  title: string;
  viewAllLink?: string;
  products: Product[];
  bgColor?: string;
}

export function ProductSlider({ title, viewAllLink, products, bgColor = 'bg-white' }: ProductSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust based on card width
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (!products.length) return null;

  return (
    <section className={`py-12 ${bgColor}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-serif-heading text-2xl md:text-3xl font-bold text-charcoal-ink">
            {title}
          </h2>
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="text-aegean-blue font-medium hover:underline decoration-aegean-blue underline-offset-4 text-sm hidden md:block"
            >
              View All
            </Link>
          )}
        </div>

        <div className="relative group">
          {/* Scroll Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 -ml-4 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white shadow-lg border border-stone-grey/10 text-charcoal-ink hover:text-aegean-blue transition-colors focus:outline-none"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10 -mr-4 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white shadow-lg border border-stone-grey/10 text-charcoal-ink hover:text-aegean-blue transition-colors focus:outline-none"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Slider Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex-none w-[160px] md:w-[200px] snap-start"
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
          
          {/* Mobile View All */}
          {viewAllLink && (
            <div className="mt-4 text-center md:hidden">
              <Link href={viewAllLink} className="text-aegean-blue font-medium text-sm">
                View All
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
