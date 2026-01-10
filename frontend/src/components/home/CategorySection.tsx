import { ProductSlider } from '@/components/ui/ProductSlider';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchCollectionProducts(categorySlug: string, limit: number = 6) {
  try {
    const response = await fetch(
      `${API_URL}/products?category=${categorySlug}&limit=${limit}`,
      { 
        cache: 'no-store',
        next: { revalidate: 300 } // Revalidate every 5 minutes
      }
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch products for category ${categorySlug}:`, response.status);
      return [];
    }
    
    const data = await response.json();
    
    // The backend returns { page, limit, total, items: [...] }
    const products = data.items || [];
    
    // Transform backend data to match ProductSlider expected format
    return products.map((product: any) => ({
      id: product.id || product.sourceUrl,
      title: product.title || 'Untitled',
      author: product.author || 'Author Unknown',
      price: product.price || 'Price unavailable',
      imageUrl: product.imageUrl || '/placeholder-book.jpg'
    }));
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return [];
  }
}

interface CategorySectionProps {
  title: string;
  categorySlug: string;
  viewAllLink: string;
  bgColor?: string;
  limit?: number;
}

export async function CategorySection({ 
  title, 
  categorySlug, 
  viewAllLink, 
  bgColor,
  limit = 6 
}: CategorySectionProps) {
  const products = await fetchCollectionProducts(categorySlug, limit);

  if (products.length === 0) {
    return null;
  }

  return (
    <ProductSlider 
      title={title} 
      products={products} 
      viewAllLink={viewAllLink}
      bgColor={bgColor}
    />
  );
}
