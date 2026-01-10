import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-aegean-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="font-serif-heading text-2xl font-bold tracking-wider text-marble-white">
              ARETĒ
            </span>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              Curating the world's knowledge for the modern explorer. Discover rare finds, timeless classics, and contemporary thought.
            </p>
            <div className="flex space-x-4 pt-2">
                <Link href="#" className="text-white/60 hover:text-olive-accent transition-colors"><Facebook className="h-5 w-5"/></Link>
                <Link href="#" className="text-white/60 hover:text-olive-accent transition-colors"><Twitter className="h-5 w-5"/></Link>
                <Link href="#" className="text-white/60 hover:text-olive-accent transition-colors"><Instagram className="h-5 w-5"/></Link>
            </div>
          </div>
          
          {/* Shop */}
          <div>
            <h4 className="font-serif-heading font-semibold text-lg mb-6 text-bronze-gold">Shop</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link href="/books" className="hover:text-marble-white transition-colors">All Books</Link></li>
              <li><Link href="/categories/fiction" className="hover:text-marble-white transition-colors">Fiction</Link></li>
              <li><Link href="/categories/non-fiction" className="hover:text-marble-white transition-colors">Non-Fiction</Link></li>
              <li><Link href="/categories/rare" className="hover:text-marble-white transition-colors">Rare & Collectible</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
             <h4 className="font-serif-heading font-semibold text-lg mb-6 text-bronze-gold">About</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link href="/about" className="hover:text-marble-white transition-colors">Our Story</Link></li>
              <li><Link href="/sustainability" className="hover:text-marble-white transition-colors">Sustainability</Link></li>
              <li><Link href="/careers" className="hover:text-marble-white transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-marble-white transition-colors">Journal</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif-heading font-semibold text-lg mb-6 text-bronze-gold">Support</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link href="/help" className="hover:text-marble-white transition-colors">Help Center</Link></li>
              <li><Link href="/shipping" className="hover:text-marble-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/sell" className="hover:text-marble-white transition-colors">Sell Your Books</Link></li>
              <li><Link href="/contact" className="hover:text-marble-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <div>&copy; {new Date().getFullYear()} Aretē. All rights reserved.</div>
          <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
