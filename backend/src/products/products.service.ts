import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductList } from '../database/entities/product-list.entity';
import { ProductDetail } from '../database/entities/product-detail.entity';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ScrapingService } from '../scraping/scraping.service';
import { ScrapeTargetType } from '../database/entities/scrape-job.entity';
import { TTL } from '../common/utils/is-stale.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductList)
    private productListRepository: Repository<ProductList>,
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
    @Inject(forwardRef(() => ScrapingService))
    private scrapingService: ScrapingService,
  ) {}

  async findAll(filterDto: ProductFilterDto) {
    const { minPrice, maxPrice, author, rating, categoryId, category, sort, page = 1, limit = 20 } = filterDto;
    const query = this.productListRepository.createQueryBuilder('product');

    // Join categories if needed
    if (categoryId) {
      query.innerJoin('product.categories', 'category', 'category.id = :categoryId', { categoryId });
    } else if (category) {
      // Filter by category slug
      query.innerJoin('product.categories', 'category', 'category.slug = :categorySlug', { categorySlug: category });
    }

    // Join details if needed (for rating only available in details)
    if (rating) {
      query.innerJoinAndSelect('product.product_detail', 'detail');
      query.andWhere('detail.rating_avg >= :rating', { rating });
    } else {
      // Optimally load detail
       query.leftJoinAndSelect('product.product_detail', 'detail');
    }

    if (minPrice) {
      query.andWhere('product.price_value >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      query.andWhere('product.price_value <= :maxPrice', { maxPrice });
    }

    if (author) {
      query.andWhere('product.author LIKE :author', { author: `%${author}%` });
    }

    if (sort) {
       switch (sort) {
         case 'price_asc':
           query.orderBy('product.price_value', 'ASC');
           break;
         case 'price_desc':
           query.orderBy('product.price_value', 'DESC');
           break;
         case 'rating_desc':
            // Only effective if joined
            if (rating) {
                query.orderBy('detail.rating_avg', 'DESC');
            } else {
                query.addOrderBy('detail.rating_avg', 'DESC'); // Will be nulls last usually
            }
           break;
         case 'newest':
           query.orderBy('product.created_at', 'DESC');
           break;
         default:
           query.orderBy('product.id', 'DESC');
       }
    } else {
        query.orderBy('product.id', 'DESC');
    }

    const skippedItems = (page - 1) * limit;
    query.skip(skippedItems).take(limit);

    const [data, total] = await query.getManyAndCount();

    // Transform to spec format: { page, limit, total, items }
    return {
      page,
      limit,
      total,
      items: data.map(product => ({
        id: product.source_id,
        title: product.title,
        author: product.author,
        price: product.price_value ? `£${Number(product.price_value).toFixed(2)}` : '£0.00',
        imageUrl: product.image_url,
        sourceUrl: product.source_url || product.source_id,
      })),
    };
  }

  async findOne(id: string) {
    let product;
    
    // Try to find by exact source_id first (full URL)
    product = await this.productListRepository.findOne({
      where: { source_id: id },
      relations: ['product_detail', 'categories'],
    });

    // If not found and id doesn't look like a full URL, try slug-based search
    if (!product && !id.startsWith('http')) {
      // Search for products where source_id ends with this slug
      const products = await this.productListRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.product_detail', 'detail')
        .leftJoinAndSelect('product.categories', 'categories')
        .where('product.source_id LIKE :slug', { slug: `%/${id}` })
        .getMany();
      
      // Take the first match
      product = products.length > 0 ? products[0] : null;
    }

    if (!product) {
      return null;
    }

    // Check if product detail is stale
    const detail = product.product_detail;
    if (detail) {
      await this.scrapingService.enqueueIfStale(
        ScrapeTargetType.PRODUCT,
        product.source_url || product.source_id,
        detail.scraped_detail_at,
        TTL.PRODUCT_DETAIL
      );
    } else {
      // No detail exists, trigger scrape
      await this.scrapingService.enqueueIfStale(
        ScrapeTargetType.PRODUCT,
        product.source_url || product.source_id,
        null,
        TTL.PRODUCT_DETAIL
      );
    }

    // Transform to spec format
    return {
      id: product.source_id,
      title: product.title,
      author: product.author,
      price: product.price_value,
      description: detail?.long_description,
      isbn: detail?.isbn,
      format: detail?.format,
      pages: detail?.pages,
      publication_date: detail?.publication_date,
      publisher: product.publisher,
      condition: product.condition,
      rating: detail?.rating_avg,
      reviewsCount: detail?.reviews_count,
      imageUrl: product.image_url,
      imageUrls: detail?.full_image_urls,
      categories: product.categories?.map(c => ({ id: c.slug, name: c.name })),
    };
  }

  async count() {
    return this.productListRepository.count();
  }
}
