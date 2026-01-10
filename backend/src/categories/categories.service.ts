import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../database/entities/category.entity';
import { Navigation } from '../database/entities/navigation.entity';
import { ScrapingService } from '../scraping/scraping.service';
import { ScrapeTargetType } from '../database/entities/scrape-job.entity';
import { TTL } from '../common/utils/is-stale.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
    @Inject(forwardRef(() => ScrapingService))
    private scrapingService: ScrapingService,
  ) {}

  async findAll() {
    // Return only root categories, but load their children recursively
    return this.categoryRepository.find({
      where: { parent: IsNull() },
      relations: ['children', 'children.children'], // Assuming max 3 levels deep for now
    });
  }

  async findByNavigation(navigationSlug: string) {
    const navigation = await this.navigationRepository.findOne({
      where: { slug: navigationSlug },
    });

    if (!navigation) {
      return { navigation: navigationSlug, categories: [] };
    }

    const categories = await this.categoryRepository.find({
      where: { navigation: { id: navigation.id } },
      relations: ['products'],
    });

    // Check staleness for categories
    for (const cat of categories) {
      await this.scrapingService.enqueueIfStale(
        ScrapeTargetType.CATEGORY,
        cat.url,
        cat.last_scraped_at,
        TTL.CATEGORY
      );
    }

    // Transform to spec format
    return {
      navigation: navigationSlug,
      categories: categories.map(cat => ({
        id: cat.slug || cat.id.toString(),
        title: cat.name,
        slug: cat.slug,
        productCount: cat.products?.length || 0,
      })),
    };
  }

  async findOneBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['children', 'parent'],
    });

    if (category) {
      // Check staleness
      await this.scrapingService.enqueueIfStale(
        ScrapeTargetType.CATEGORY,
        category.url,
        category.last_scraped_at,
        TTL.CATEGORY
      );
    }

    return category;
  }
}
