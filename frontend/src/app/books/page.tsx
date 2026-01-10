import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

// Mock Data
const MOCK_PRODUCTS = [
  { id: '101', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: '£8.99', imageUrl: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover' },
  { id: '102', title: '1984', author: 'George Orwell', price: '£7.49', imageUrl: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover' },
  { id: '103', title: 'To Kill a Mockingbird', author: 'Harper Lee', price: '£9.99', imageUrl: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover' },
  { id: '104', title: 'Pride and Prejudice', author: 'Jane Austen', price: '£6.49', imageUrl: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover' },
  { id: '105', title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: '£8.49', imageUrl: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover' },
  { id: '106', title: 'The Hobbit', author: 'J.R.R. Tolkien', price: '£10.99', imageUrl: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover' },
  { id: '107', title: 'Brave New World', author: 'Aldous Huxley', price: '£9.49', imageUrl: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover' },
  { id: '108', title: 'Moby Dick', author: 'Herman Melville', price: '£11.99', imageUrl: 'https://placehold.co/400x600/e2e8f0/1e293b?text=Book+Cover' },
];

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-marble-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="font-serif-heading text-4xl font-bold text-charcoal-ink mb-4">Browse Books</h1>
          <p className="text-stone-grey max-w-2xl">
            Discover our extensive collection of rare and popular titles. Filter by genre, price, or rating to find your next read.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-lg border border-stone-grey/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif-heading font-semibold text-charcoal-ink">Filters</h3>
                <Button variant="ghost" size="sm" className="text-stone-grey text-xs h-auto p-0">Reset</Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-charcoal-ink mb-3 font-sans">Categories</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm text-stone-grey hover:text-aegean-blue cursor-pointer">
                      <input type="checkbox" className="rounded border-stone-grey/30 text-aegean-blue focus:ring-aegean-blue" />
                      <span>Fiction (1,240)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-stone-grey hover:text-aegean-blue cursor-pointer">
                      <input type="checkbox" className="rounded border-stone-grey/30 text-aegean-blue focus:ring-aegean-blue" />
                      <span>Non-Fiction (890)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-stone-grey hover:text-aegean-blue cursor-pointer">
                      <input type="checkbox" className="rounded border-stone-grey/30 text-aegean-blue focus:ring-aegean-blue" />
                      <span>History (450)</span>
                    </label>
                     <label className="flex items-center space-x-2 text-sm text-stone-grey hover:text-aegean-blue cursor-pointer">
                      <input type="checkbox" className="rounded border-stone-grey/30 text-aegean-blue focus:ring-aegean-blue" />
                      <span>Science (320)</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-stone-grey/10 pt-4">
                  <h4 className="text-sm font-medium text-charcoal-ink mb-3 font-sans">Price Range</h4>
                   <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm text-stone-grey hover:text-aegean-blue cursor-pointer">
                      <input type="checkbox" className="rounded border-stone-grey/30 text-aegean-blue focus:ring-aegean-blue" />
                      <span>Under £5</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-stone-grey hover:text-aegean-blue cursor-pointer">
                      <input type="checkbox" className="rounded border-stone-grey/30 text-aegean-blue focus:ring-aegean-blue" />
                      <span>£5 - £10</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-stone-grey hover:text-aegean-blue cursor-pointer">
                      <input type="checkbox" className="rounded border-stone-grey/30 text-aegean-blue focus:ring-aegean-blue" />
                      <span>£10 - £20</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-stone-grey hover:text-aegean-blue cursor-pointer">
                      <input type="checkbox" className="rounded border-stone-grey/30 text-aegean-blue focus:ring-aegean-blue" />
                      <span>Over £20</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <span className="text-stone-grey text-sm">Showing 1-12 of 3,240 results</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <div className="relative inline-block text-left w-full sm:w-48">
                    <select className="w-full h-10 pl-3 pr-10 text-sm bg-white border border-stone-grey/30 rounded-md focus:outline-none focus:ring-1 focus:ring-aegean-blue text-charcoal-ink appearance-none cursor-pointer">
                      <option>Sort by: Most Popular</option>
                      <option>Sort by: Newest</option>
                      <option>Sort by: Price (Low to High)</option>
                      <option>Sort by: Price (High to Low)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-stone-grey pointer-events-none" />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    author={product.author}
                    price={product.price}
                    imageUrl={product.imageUrl}
                  />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="primary" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <span className="flex items-center px-2 text-stone-grey">...</span>
              <Button variant="outline" size="sm">12</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
