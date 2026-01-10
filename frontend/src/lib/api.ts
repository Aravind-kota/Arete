const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface NavigationItem {
  id: string;
  title: string;
  slug: string;
  type: 'COLLECTION' | 'PROMO' | 'AUTHOR' | 'IGNORE';
  url: string;
}

export interface NavigationGroupSection {
  title: string;
  items: NavigationItem[];
}

export interface NavigationGroup {
  id: string;
  title: string;
  slug: string;
  sections: NavigationGroupSection[];
}

export async function fetchNavigation(): Promise<NavigationGroup[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/navigation`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch navigation');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return [];
  }
}
