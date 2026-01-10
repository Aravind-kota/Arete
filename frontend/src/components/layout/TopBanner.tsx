import Link from "next/link";

export function TopBanner() {
  return (
    <div className="bg-aegean-blue text-white py-2 text-xs font-sans tracking-wide">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex gap-4">
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex gap-6">
          <Link href="/help" className="hover:text-marble-white transition-colors">
            Help
          </Link>
          <Link href="/track-order" className="hover:text-marble-white transition-colors">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
