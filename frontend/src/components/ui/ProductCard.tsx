import Link from 'next/link';
import { Heart, Star } from 'lucide-react';

interface ProductCardProps {
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

// Helper function to create a URL-safe slug from the product ID
function getProductSlug(id: string): string {
  // If id is a URL, extract the last part (e.g., "name-of-the-wind-book-patrick-rothfuss-9780575081406")
  // Otherwise, use the id as-is and encode it
  if (id.includes('/')) {
    const parts = id.split('/');
    return parts[parts.length - 1] || encodeURIComponent(id);
  }
  return encodeURIComponent(id);
}

export function ProductCard({
  id,
  title,
  author,
  price,
  imageUrl,
  condition,
  specialOffer,
  rating,
  ratingCount,
  year,
}: ProductCardProps) {
  const productSlug = getProductSlug(id);
  
  return (
    <div className="group relative flex flex-col bg-white border border-stone-grey/10 rounded overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <Link href={`/product/${productSlug}`} className="block relative aspect-[2/3] bg-marble-white overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-grey bg-marble-white">
            <span className="text-xs">No Image</span>
          </div>
        )}
        
        {/* Wishlist Heart */}
        <button 
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4 text-charcoal-ink" />
        </button>
      </Link>
      
      {/* Content */}
      <div className="flex flex-col p-3 flex-1">
        <h3 className="text-sm font-medium text-charcoal-ink line-clamp-2 mb-1 leading-tight min-h-[2.5rem]">
          <Link href={`/product/${productSlug}`} className="hover:text-aegean-blue transition-colors">
            {title}
          </Link>
        </h3>
        
        <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
                {author && (
                <p className="text-xs text-stone-grey line-clamp-1">{author}</p>
                )}
                 {year && (
                <p className="text-[10px] text-stone-grey/70">{year}</p>
                )}
            </div>
        </div>

         {/* Rating */}
         {rating !== undefined && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            {ratingCount !== undefined && (
              <span className="text-[10px] text-stone-grey">({ratingCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="text-lg font-bold text-charcoal-ink mb-2">
          {price}
        </div>

        {/* Special Offer Tag */}
        {specialOffer && (
          <div className="mb-2">
            <span className="inline-block bg-olive-accent/10 text-olive-accent text-[10px] font-bold px-2 py-1 rounded">
              {specialOffer}
            </span>
          </div>
        )}

        {/* Add to Basket Button */}
        <button className="w-full bg-[#FFD700] hover:bg-[#FFC700] text-charcoal-ink font-bold text-sm py-2.5 rounded transition-colors mt-auto">
          Add To Basket
        </button>
      </div>
    </div>
  );
}
