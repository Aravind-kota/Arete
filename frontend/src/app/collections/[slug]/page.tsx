'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { CollectionHero } from '@/components/ui/CollectionHero';
import { CollectionFilters } from '@/components/ui/CollectionFilters';
import { ProductDetailSkeleton, ProductGridSkeleton } from '@/components/ui/Skeleton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Product {
  id: string;
  title: string;
  author?: string;
  price: string;
  imageUrl: string;
}

interface ProductsResponse {
  page: number;
  limit: number;
  total: number;
  items: Product[];
}

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any>(null);

  // Fetch category metadata
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await fetch(`${API_URL}/categories/slug/${slug}`);
        if (response.ok) {
          const text = await response.text();
          if (text) {
            const data = JSON.parse(text);
            setCategory(data);
          }
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        // Category is optional, so we can continue without it
      }
    }
    fetchCategory();
  }, [slug]);

  // Reset page when slug changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [slug]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products?category=${slug}&page=${page}&limit=40`);
        
        if (response.ok) {
          const data: ProductsResponse = await response.json();
          if (page === 1) {
            setProducts(data.items);
          } else {
            setProducts(prev => [...prev, ...data.items]);
          }
          setTotal(data.total);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (page > 0) {
      fetchProducts();
    }
  }, [slug, page]);

  // Load more products
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Generate hero content based on category
  const heroContent = {
    title: category ? `Used ${category.name}` : `Used ${formatSlug(slug)}`,
    subtitle: getSubtitle(slug),
    description: getDescription(slug),
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <CollectionHero {...heroContent} />
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex gap-8">
             <aside className="hidden lg:block w-64 flex-shrink-0">
                <CollectionFilters />
             </aside>
             <div className="flex-1">
                <ProductGridSkeleton />
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CollectionHero {...heroContent} />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <CollectionFilters />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Product Count and Sort */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-stone-grey">
                {total.toLocaleString()} products
              </p>
              <select className="border border-stone-grey/20 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aegean-blue/20">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>

            {/* Product Grid */}
            <ProductGrid products={products} />

            {/* Load More */}
            {total > 0 && (
              <div className="mt-12 text-center">
                <p className="text-sm text-stone-grey mb-4">
                  You have seen {products.length} products out of {total.toLocaleString()}
                </p>
                <button 
                  onClick={handleLoadMore}
                  disabled={loading || products.length >= total}
                  className="px-8 py-3 bg-charcoal-ink text-white font-bold rounded hover:bg-charcoal-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {products.length >= total ? 'All Products Loaded' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getSubtitle(slug: string): string {
  const subtitles: Record<string, string> = {
    'fiction-books': 'Top up your reading nook with second-hand books',
    'non-fiction-books': 'Take a leap into the depths of knowledge',
    'childrens-books': 'Spark imagination with preloved stories',
    'rare-books': 'Discover unique and collectible editions',
  };
  return subtitles[slug] || 'Discover our curated collection';
}

function getDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    'fiction-books': 'Welcome to the world of used fiction books. Whether you want to use our handy category filter to jump straight into your favourite genre, or you want to search through thousands of cheap fiction books right here, you can search through thousands of new fiction books right here.',
    'non-fiction-books': 'Explore our vast collection of second-hand non-fiction books. From biographies to self-help, history to science, find your next great read at unbeatable prices.',
    'childrens-books': 'Give the gift of reading with our selection of preloved children\'s books. From picture books to young adult novels, inspire the next generation of readers.',
  };
  return descriptions[slug] || 'Browse our extensive collection of quality used books.';
}
