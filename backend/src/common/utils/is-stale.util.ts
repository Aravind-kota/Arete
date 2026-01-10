/**
 * TTL Constants (in hours)
 */
export const TTL = {
  NAVIGATION: 24,
  CATEGORY: 12,
  PRODUCT_LIST: 6,
  PRODUCT_DETAIL: 24,
};

/**
 * Checks if data is stale based on last scraped timestamp and TTL
 * @param lastScrapedAt - The timestamp when data was last scraped
 * @param ttlHours - Time-to-live in hours
 * @returns true if data is stale or missing, false otherwise
 */
export function isStale(lastScrapedAt: Date | null | undefined, ttlHours: number): boolean {
  if (!lastScrapedAt) {
    return true;
  }
  
  const now = new Date();
  const staleThreshold = new Date(lastScrapedAt.getTime() + ttlHours * 60 * 60 * 1000);
  
  return now > staleThreshold;
}
