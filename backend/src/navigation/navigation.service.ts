import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NavigationGroup } from '../database/entities/navigation-group.entity';
import { NavigationItem } from '../database/entities/navigation-item.entity';
import { ScrapingService } from '../scraping/scraping.service';
import { ScrapeTargetType } from '../database/entities/scrape-job.entity';
import { TTL } from '../common/utils/is-stale.util';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(NavigationGroup)
    private navigationGroupRepository: Repository<NavigationGroup>,
    @InjectRepository(NavigationItem)
    private navigationItemRepository: Repository<NavigationItem>,
    @Inject(forwardRef(() => ScrapingService))
    private scrapingService: ScrapingService,
  ) {}

  async findAll() {
    // Fetch all navigation groups with their items
    const groups = await this.navigationGroupRepository.find({
      relations: ['items'],
    });
    
    // Check if any navigation needs refreshing
    for (const group of groups) {
      await this.scrapingService.enqueueIfStale(
        ScrapeTargetType.NAVIGATION,
        'https://www.worldofbooks.com/en-gb',
        group.last_scraped_at,
        TTL.NAVIGATION
      );
    }
    
    // If no navigation data, trigger initial scrape
    if (groups.length === 0) {
      await this.scrapingService.enqueueIfStale(
        ScrapeTargetType.NAVIGATION,
        'https://www.worldofbooks.com/en-gb',
        null,
        TTL.NAVIGATION
      );
      return [];
    }
    
    // Helper function to categorize items into sections
    const categorizeItem = (item: NavigationItem): string => {
      const title = item.title.toLowerCase();
      
      // Special Features indicators (trending, new, prize, celebrate, books of month, LGBTQ+, etc.)
      if (title.includes('trending') || 
          title.includes('new ') ||
          title.includes('prize') ||
          title.includes('winner') ||
          title.includes('celebrate') ||
          title.includes('of the month') ||
          title.includes('lgbtq') ||
          title.includes('booker') ||
          title.includes('award')) {
        return 'Special Features';
      }
      
      // Top Authors - typically just names (FirstName LastName pattern)
      if (item.type === 'AUTHOR' || /^[A-Z][a-z]+ [A-Z]/.test(item.title)) {
        return 'Top Authors';
      }
      
      // Everything else goes to By Category
      return 'By Category';
    };
    
    // Transform to hierarchical format
    return groups.map(group => {
      // Reorganize items into three sections
      const byCategory: any[] = [];
      const specialFeatures: any[] = [];
      const topAuthors: any[] = [];
      
      if (group.items) {
        for (const item of group.items) {
          const itemData = {
            id: item.id,
            title: item.title,
            slug: item.slug,
            type: item.type,
            url: item.source_url,
          };
          
          const section = categorizeItem(item);
          if (section === 'By Category') {
            byCategory.push(itemData);
          } else if (section === 'Special Features') {
            specialFeatures.push(itemData);
          } else {
            topAuthors.push(itemData);
          }
        }
      }
      
      // Build sections array (only include non-empty sections)
      const sections: Array<{ title: string; items: any[] }> = [];
      if (byCategory.length > 0) {
        sections.push({ title: 'By Category', items: byCategory });
      }
      if (specialFeatures.length > 0) {
        sections.push({ title: 'Special Features', items: specialFeatures });
      }
      if (topAuthors.length > 0) {
        sections.push({ title: 'Top Authors', items: topAuthors });
      }
      
      return {
        id: group.id,
        title: group.title,
        slug: group.slug,
        sections,
      };
    });
  }
}
