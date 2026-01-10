import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { ChevronLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Mock Data - Fiction Category
const MOCK_SUBCATEGORIES = [
  { id: 'all', title: 'All', count: 5 },
  { id: 'classic', title: 'Classic Literature', count: 2 },
  { id: 'poetry', title: 'Poetry', count: 1 },
  { id: 'contemporary', title: 'Contemporary', count: 2 },
];

const MOCK_PRODUCTS = [
  { 
    id: '101', 
    title: 'THE GREAT GATSBY', 
    author: 'F. Scott Fitzgerald', 
    price: '£12.50',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    condition: 'Very Good',
    rating: 4.8,
    ratingCount: 489,
    year: '1925'
  },
  { 
    id: '102', 
    title: 'TO KILL A MOCKINGBIRD', 
    author: 'Harper Lee', 
    price: '£10.99',
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800',
    condition: 'Good',
    rating: 4.9,
    ratingCount: 1203,
    year: '1960'
  },
  { 
    id: '103', 
    title: '1984', 
    author: 'George Orwell', 
    price: '£9.50',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    condition: 'Very Good',
    rating: 4.7,
    ratingCount: 856,
    year: '1949'
  },
  { 
    id: '104', 
    title: 'PRIDE AND PREJUDICE', 
    author: 'Jane Austen', 
    price: '£8.99',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    condition: 'Like New',
    rating: 4.9,
    ratingCount: 672,
    year: '1813'
  },
  { 
    id: '105', 
    title: 'THE CATCHER IN THE RYE', 
    author: 'J.D. Salinger', 
    price: '£11.50',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    condition: 'Good',
    rating: 4.3,
    ratingCount: 534,
    year: '1951'
  },
];

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params; 
  const categoryTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' & ');
  const categorySubtitle = "Classic and contemporary narratives";

  return (
    <div className="min-h-screen bg-marble-white">
      {/* Hero Header Section */}
      <section className="relative bg-[#1E4E79] text-white py-16 overflow-hidden border-t-4 border-b-4 border-[#C9A45C]">
        {/* Vertical Pinstripes Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(to right, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08) 1px, transparent 1px, transparent 16px)'
          }}
        ></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Content Block - Left Aligned with Asymmetric Margin */}
          <div className="max-w-5xl md:ml-24">
            {/* Back to Categories Link */}
            <Link 
              href="/categories" 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 text-sm group"
            >
              <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
              Back to Categories
            </Link>

            {/* Category Title with Icon */}
            <div className="flex items-start gap-6">
              <div className="hidden md:block p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <BookOpen className="h-12 w-12 text-[#C9A45C]" />
              </div>
              <div>
                <h1 className="font-serif-heading text-4xl md:text-5xl font-bold uppercase tracking-wide mb-3">
                  {categoryTitle}
                </h1>
                <p className="text-lg md:text-xl text-white/90 italic font-serif-sub">
                  {categorySubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-stone-grey/10 py-6 sticky top-[140px] z-40 shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-4">
            <span className="text-sm font-medium text-charcoal-ink">Filter by:</span>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {MOCK_SUBCATEGORIES.map((subcat, index) => (
              <button
                key={subcat.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  index === 0 
                    ? 'bg-aegean-blue text-white shadow-md' 
                    : 'bg-stone-grey/10 text-charcoal-ink hover:bg-stone-grey/20'
                }`}
              >
                {subcat.title} ({subcat.count})
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="text-sm text-stone-grey">
            Showing 1-{MOCK_PRODUCTS.length} of {MOCK_PRODUCTS.length} books
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                author={product.author}
                price={product.price}
                imageUrl={product.imageUrl}
                condition={product.condition}
                rating={product.rating}
                ratingCount={product.ratingCount}
                year={product.year}
              />
            ))}
          </div>
          
          {/* Load More / Pagination would go here for larger datasets */}
        </div>
      </section>
    </div>
  );
}
