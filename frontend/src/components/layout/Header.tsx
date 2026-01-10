'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, Heart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { fetchNavigation, NavigationGroup, NavigationGroupSection } from '@/lib/api';

// Hardcoded navigation structure in the required order
const MAIN_NAVIGATION = [
  { title: 'Clearance', slug: 'clearance', hasMegaMenu: false },
  { title: 'Fiction Books', slug: 'fiction-books', hasMegaMenu: true },
  { title: 'Non-Fiction Books', slug: 'non-fiction-books', hasMegaMenu: true },
  { title: 'Children\'s Books', slug: 'childrens-books', hasMegaMenu: true },
  { title: 'Rare Books', slug: 'rare-books', hasMegaMenu: true },
  { title: 'Music & Film', slug: 'music-film', hasMegaMenu: true },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [navigationData, setNavigationData] = useState<NavigationGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNavigation() {
      const data = await fetchNavigation();
      setNavigationData(data);
      setLoading(false);
    }
    loadNavigation();
  }, []);

  // Helper function to find navigation data by slug
  const getNavigationBySlug = (slug: string): NavigationGroup | undefined => {
    return navigationData.find(nav => nav.slug === slug);
  };

  const renderMegaMenu = (sections: NavigationGroupSection[]) => {
    if (!sections || sections.length === 0) return null;
    
    return (
      <div className="absolute w-full left-0 right-0 top-full bg-white border-t border-stone-grey/10 shadow-xl z-50">
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-3 gap-16">
            {sections.map((section, idx) => (
              <div key={idx}>
                {section.title && (
                  <h3 className="font-sans font-bold text-charcoal-ink mb-5 text-base">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-3">
                  {section.items.slice(0, 8).map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <Link
                        href={item.type === 'COLLECTION' ? `/collections/${item.slug}` : item.url}
                        className="text-sm text-charcoal-ink hover:text-aegean-blue transition-colors block leading-relaxed"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="w-full bg-white shadow-sm font-sans">
      {/* Main Bar */}
      <div className="border-b border-stone-grey/10">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/full_logo.svg"
              alt="ARETĒ"
              width={150}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Search Bar - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-aegean-blue" />
            <Input
              type="search"
              placeholder="Search by title, author or ISBN"
              className="pl-10 h-10 w-full bg-marble-white border-stone-grey/20 focus:ring-aegean-blue focus:border-aegean-blue"
            />
          </div>

          {/* Icons / Actions */}
          <div className="flex items-center space-x-2 md:space-x-6 text-charcoal-ink">
             <Link href="/account" className="hidden md:flex flex-col items-center hover:text-aegean-blue transition-colors group">
              <User className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-wide font-medium">Account</span>
            </Link>
            <Link href="/wishlist" className="hidden md:flex flex-col items-center hover:text-aegean-blue transition-colors group">
              <Heart className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-wide font-medium">Wishlist</span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center hover:text-aegean-blue transition-colors group relative">
              <ShoppingBag className="h-6 w-6 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-wide font-medium hidden md:block">Cart</span>
              <span className="absolute -top-1 -right-1 bg-olive-accent text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">0</span>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-charcoal-ink"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop with Mega Menus */}
      <div className="hidden md:block bg-white relative">
        <div className="container mx-auto px-4 md:px-6 flex justify-center space-x-12">
          {loading ? (
            <div className="py-4 flex space-x-12 animate-pulse">
               {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 w-24 bg-stone-grey/20 rounded"></div>
               ))}
            </div>
          ) : (
            MAIN_NAVIGATION.map((navItem) => {
              const navData = getNavigationBySlug(navItem.slug);
              const hasSections = navData?.sections && navData.sections.length > 0;
              
              return (
                <div
                  key={navItem.slug}
                  className="py-4"
                  onMouseEnter={() => navItem.hasMegaMenu && hasSections ? setActiveMegaMenu(navItem.slug) : null}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link 
                    href={`/collections/${navItem.slug}`}
                    className="text-sm font-bold text-aegean-blue hover:text-bronze-gold transition-colors uppercase tracking-wide"
                  >
                    {navItem.title}
                  </Link>
                  {navItem.hasMegaMenu && activeMegaMenu === navItem.slug && navData?.sections && renderMegaMenu(navData.sections)}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden p-4 border-b border-stone-grey/10 bg-marble-white">
         <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-grey" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 bg-white w-full"
            />
          </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-grey/20 shadow-lg py-4 px-4 flex flex-col space-y-4 z-50">
          {MAIN_NAVIGATION.map((navItem) => (
            <Link 
              key={navItem.slug}
              href={`/collections/${navItem.slug}`}
              className="text-lg font-medium text-charcoal-ink py-2 border-b border-stone-grey/5"
              onClick={() => setIsMenuOpen(false)}
            >
              {navItem.title}
            </Link>
          ))}
          <div className="flex gap-4 pt-2">
            <Link href="/account" className="flex items-center gap-2 text-sm font-medium text-charcoal-ink">
              <User className="h-5 w-5" /> Account
            </Link>
            <Link href="/wishlist" className="flex items-center gap-2 text-sm font-medium text-charcoal-ink">
              <Heart className="h-5 w-5" /> Wishlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
