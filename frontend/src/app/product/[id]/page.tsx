'use client';

import { use, useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/Button';
import { Star, Truck, ShieldCheck, Heart, Share2, Book, Calendar, Globe, AlertCircle } from 'lucide-react';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductPage({ params }: ProductPageProps) {
  // Unwrap the async params using React.use() for Next.js 15 compatibility
  const { id } = use(params);
  
  // URL decode the ID if it contains special chars (which URLs often do)
  const decodedId = decodeURIComponent(id);

  const { data: product, error, isLoading } = useSWR(`${API_URL}/products/${encodeURIComponent(decodedId)}`, fetcher);

  // Simple image gallery state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (error) {
     return (
        <div className="min-h-screen bg-white flex items-center justify-center">
           <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-charcoal-ink">Product not found</h2>
              <p className="text-stone-grey mt-2">The book you are looking for might be out of stock or does not exist.</p>
              <Button onClick={() => window.history.back()} className="mt-6">Go Back</Button>
           </div>
        </div>
     );
  }

  if (isLoading || !product) {
     return <ProductDetailSkeleton />;
  }

  const mainImage = selectedImage || (product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : product.imageUrl);
  
  // Format description (handle HTML or plain text slightly safely)
  const description = product.description || 'No description available for this title.';

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb - Dynamic if we had category info */}
        <nav className="mb-8 text-xs md:text-sm text-stone-grey flex flex-wrap gap-2">
           <span>Home</span> / 
           {product.categories && product.categories.length > 0 ? (
               <>
                 <span>{product.categories[0].name}</span> / 
               </>
           ) : (
               <>
                 <span>Books</span> /
               </>
           )}
           <span className="text-charcoal-ink font-medium line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Product Image Section */}
          <div className="flex flex-col gap-4">
             <div className="relative aspect-[3/4] md:aspect-[1/1] overflow-hidden rounded-xl bg-marble-white border border-stone-grey/10 max-h-[600px] w-full max-w-md mx-auto lg:max-w-none flex items-center justify-center">
                {mainImage ? (
                    <img 
                       src={mainImage} 
                       alt={product.title} 
                       className="max-w-full max-h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-stone-grey p-8 text-center">
                        <Book className="h-16 w-16 mb-4 opacity-20" />
                        <span className="text-sm">Image not available</span>
                    </div>
                )}
             </div>
             
             {/* Thumbnails */}
             {product.imageUrls && product.imageUrls.length > 1 && (
                 <div className="flex gap-2 justify-center overflow-x-auto py-2">
                    {product.imageUrls.map((url: string, index: number) => (
                        <button 
                           key={index} 
                           onClick={() => setSelectedImage(url)}
                           className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 border rounded overflow-hidden p-1 ${selectedImage === url ? 'border-aegean-blue ring-1 ring-aegean-blue' : 'border-stone-grey/20'}`}
                        >
                           <img src={url} alt={`View ${index + 1}`} className="w-full h-full object-contain" />
                        </button>
                    ))}
                 </div>
             )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif-heading text-charcoal-ink leading-tight">
              {product.title}
            </h1>
            
            {product.author && (
                <div className="mt-2 text-lg text-aegean-blue font-medium hover:underline cursor-pointer">
                  by {product.author}
                </div>
            )}

            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center text-bronze-gold">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 text-gray-300" />
                <span className="ml-2 text-sm font-medium text-charcoal-ink">4.0 (GoodReads)</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-marble-white/50 rounded-lg border border-stone-grey/5 inline-block">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-charcoal-ink text-bronze-gold">
                      {product.price ? `£${Number(product.price).toFixed(2)}` : 'Check Price'}
                    </span>
                    <span className="text-sm text-stone-grey">Free Shipping</span>
                </div>
                {product.condition && (
                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-white border border-stone-grey/20 text-xs font-bold uppercase tracking-wider text-olive-accent">
                        Condition: {product.condition}
                    </div>
                )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1 bg-aegean-blue hover:bg-aegean-blue/90 h-12 text-base">
                Add to Basket
              </Button>
              <Button size="lg" variant="outline" className="px-4 border-stone-grey/30 hover:bg-stone-grey/5 h-12">
                <Heart className="h-5 w-5 text-charcoal-ink" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-marble-white/30">
                <Truck className="mt-1 h-5 w-5 text-aegean-blue flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-sm text-charcoal-ink">Free Delivery</h4>
                    <p className="text-xs text-stone-grey">On all orders within the UK.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-marble-white/30">
                <ShieldCheck className="mt-1 h-5 w-5 text-olive-accent flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-sm text-charcoal-ink">Quality Guaranteed</h4>
                    <p className="text-xs text-stone-grey">Every book is hand-checked.</p>
                </div>
              </div>
            </div>

            {/* Book Details Grid */}
             <div className="mt-10 pt-8 border-t border-stone-grey/10">
              <h3 className="text-lg font-bold font-serif-heading text-charcoal-ink mb-4">Book Details</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                 {product.isbn && (
                   <div>
                     <dt className="text-xs text-stone-grey uppercase tracking-wider mb-1">ISBN</dt>
                     <dd className="text-sm font-medium text-charcoal-ink">{product.isbn}</dd>
                   </div>
                 )}
                 {product.format && (
                   <div>
                     <dt className="text-xs text-stone-grey uppercase tracking-wider mb-1">Format</dt>
                     <dd className="text-sm font-medium text-charcoal-ink">{product.format}</dd>
                   </div>
                 )}
                 {product.pages && (
                   <div>
                     <dt className="text-xs text-stone-grey uppercase tracking-wider mb-1">Pages</dt>
                     <dd className="text-sm font-medium text-charcoal-ink">{product.pages}</dd>
                   </div>
                 )}
                 {product.publication_date && (
                   <div>
                     <dt className="text-xs text-stone-grey uppercase tracking-wider mb-1">Published</dt>
                     <dd className="text-sm font-medium text-charcoal-ink">
                        {new Date(product.publication_date).toLocaleDateString()}
                     </dd>
                   </div>
                 )}
                 {product.publisher && (
                   <div className="col-span-2">
                     <dt className="text-xs text-stone-grey uppercase tracking-wider mb-1">Publisher</dt>
                     <dd className="text-sm font-medium text-charcoal-ink">{product.publisher}</dd>
                   </div>
                 )}
              </dl>
            </div>
          </div>
        </div>

        {/* Long Description */}
        <div className="mt-12 md:mt-16 max-w-4xl">
            <h3 className="text-xl font-bold font-serif-heading text-charcoal-ink mb-6 border-b border-stone-grey/10 pb-4">
                About the Book
            </h3>
            <div className="prose prose-stone max-w-none text-charcoal-ink leading-relaxed">
                {/* We render safe HTML if we trust the source, or just text */}
                <p className="whitespace-pre-wrap">{description}</p>
            </div>
        </div>

      </div>
    </div>
  );
}
