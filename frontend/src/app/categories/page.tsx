import { CategoryCard } from '@/components/ui/CategoryCard';

const FEATURED_CATEGORIES = [
  { id: '1', title: 'Fiction', slug: 'fiction', count: 1250 },
  { id: '2', title: 'Non-Fiction', slug: 'non-fiction', count: 980 },
  { id: '3', title: 'Children\'s Books', slug: 'childrens-books', count: 450 },
  { id: '4', title: 'Science & Nature', slug: 'science-nature', count: 320 },
  { id: '5', title: 'History', slug: 'history', count: 560 },
  { id: '6', title: 'Art & Photography', slug: 'art-photography', count: 210 },
];

const ALL_CATEGORIES = [
  'Academic', 'Biography', 'Business', 'Comics', 'Cookery', 
  'Crime', 'Education', 'Fantasy', 'Health', 'Hobbies', 
  'Home & Garden', 'Horror', 'Humour', 'Medical', 'Music', 
  'Poetry', 'Psychology', 'Religion', 'Romance', 'Sci-Fi', 
  'Sport', 'Travel'
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-marble-white py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif-heading text-4xl md:text-5xl font-bold text-charcoal-ink mb-6">
            Explore Collections
          </h1>
          <p className="text-stone-grey text-lg">
            From rare first editions to contemporary bestsellers, explore our diverse catalog of categories curated for every interest.
          </p>
        </div>

        {/* Featured Section */}
        <section className="mb-20">
          <h2 className="font-serif-heading text-2xl font-bold text-charcoal-ink mb-8 border-b border-stone-grey/20 pb-4">
            Featured Collections
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {FEATURED_CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                title={category.title}
                slug={category.slug}
                count={category.count}
                className="h-full"
              />
            ))}
          </div>
        </section>

        {/* All Categories List */}
        <section>
          <h2 className="font-serif-heading text-2xl font-bold text-charcoal-ink mb-8 border-b border-stone-grey/20 pb-4">
            All Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ALL_CATEGORIES.map((cat, index) => (
              <a 
                key={index}
                href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                className="flex items-center p-4 rounded-lg bg-white border border-stone-grey/10 text-charcoal-ink hover:text-aegean-blue hover:border-aegean-blue/30 hover:shadow-sm transition-all group"
              >
                <span className="font-medium">{cat}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
