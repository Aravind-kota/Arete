import Link from 'next/link';

const CATEGORIES = [
  { name: 'Fiction', slug: 'fiction', color: 'bg-rose-100', textColor: 'text-rose-900' },
  { name: 'Non-Fiction', slug: 'non-fiction', color: 'bg-blue-100', textColor: 'text-blue-900' },
  { name: 'Children\'s', slug: 'childrens-books', color: 'bg-yellow-100', textColor: 'text-yellow-900' },
  { name: 'Crime', slug: 'crime-fiction', color: 'bg-slate-100', textColor: 'text-slate-900' },
  { name: 'Sci-Fi', slug: 'sci-fi', color: 'bg-indigo-100', textColor: 'text-indigo-900' },
  { name: 'Rare Books', slug: 'rare-books', color: 'bg-amber-100', textColor: 'text-amber-900' },
  { name: 'Biographies', slug: 'biography', color: 'bg-emerald-100', textColor: 'text-emerald-900' },
  { name: 'History', slug: 'history', color: 'bg-orange-100', textColor: 'text-orange-900' },
];

export function CategoryRail() {
  return (
    <section className="py-8 bg-white border-b border-stone-grey/10">
      <div className="container mx-auto px-4">
        <h2 className="font-serif-heading text-xl font-bold text-charcoal-ink mb-6 hidden md:block">
          Shop by Category
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:pb-0">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/collections/${cat.slug}`}
              className="flex flex-col items-center gap-2 group min-w-[80px]"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-200`}>
                <span className={`font-bold text-lg md:text-xl ${cat.textColor}`}>
                  {cat.name.charAt(0)}
                </span>
              </div>
              <span className="text-xs md:text-sm font-medium text-charcoal-ink text-center max-w-[80px] leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
