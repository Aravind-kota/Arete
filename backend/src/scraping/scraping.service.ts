import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { ProductList } from '../database/entities/product-list.entity';
import { ProductDetail } from '../database/entities/product-detail.entity';
import { Navigation } from '../database/entities/navigation.entity';
import { NavigationGroup } from '../database/entities/navigation-group.entity';
import { NavigationItem, NavigationItemType } from '../database/entities/navigation-item.entity';
import { Category } from '../database/entities/category.entity';
import { ScrapeJob, ScrapeJobStatus, ScrapeTargetType } from '../database/entities/scrape-job.entity';
import { RefreshScrapeDto } from './dtos/refresh-scrape.dto';
import { PlaywrightCrawler, Dataset } from 'crawlee';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    @InjectRepository(ProductList)
    private productListRepository: Repository<ProductList>,
    @InjectRepository(ProductDetail)
    private productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
    @InjectRepository(NavigationGroup)
    private navigationGroupRepository: Repository<NavigationGroup>,
    @InjectRepository(NavigationItem)
    private navigationItemRepository: Repository<NavigationItem>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ScrapeJob)
    private scrapeJobRepository: Repository<ScrapeJob>,
    @InjectQueue('scrape') private scrapeQueue: Queue,
  ) {}

  async startScrape(url: string = 'https://www.worldofbooks.com/en-gb') {
    this.logger.log(`Queueing scrape job for ${url}`);
    
    // Create a tracked ScrapeJob
    const job = await this.scrapeJobRepository.save({
      target_type: ScrapeTargetType.NAVIGATION,
      target_url: url,
      status: ScrapeJobStatus.PENDING,
    });
    
    await this.scrapeQueue.add('scrape-job', { url, jobId: job.id });
    return { message: 'Scrape job started', jobId: job.id, url };
  }

  async refreshTarget(dto: RefreshScrapeDto) {
    this.logger.log(`Refreshing ${dto.targetType} target`);
    
    let targetUrl = dto.targetUrl;
    
    // If targetId provided, look up the URL
    if (dto.targetId && !targetUrl) {
      switch (dto.targetType) {
        case ScrapeTargetType.PRODUCT:
          const product = await this.productListRepository.findOne({ where: { source_id: dto.targetId } });
          targetUrl = product?.source_url || dto.targetId;
          break;
        case ScrapeTargetType.CATEGORY:
          const category = await this.categoryRepository.findOne({ where: { slug: dto.targetId } });
          targetUrl = category?.url;
          break;
        case ScrapeTargetType.NAVIGATION:
          const nav = await this.navigationRepository.findOne({ where: { slug: dto.targetId } });
          targetUrl = nav?.url;
          break;
      }
    }

    if (!targetUrl) {
      return { message: 'Could not resolve target URL', success: false };
    }

    // Check for existing pending/running job for same target
    const existingJob = await this.scrapeJobRepository.findOne({
      where: {
        target_url: targetUrl,
        status: ScrapeJobStatus.PENDING,
      },
    });

    if (existingJob) {
      return { message: 'Job already pending', jobId: existingJob.id, success: true };
    }

    // Create new tracked job
    const job = await this.scrapeJobRepository.save({
      target_type: dto.targetType,
      target_url: targetUrl,
      target_id: dto.targetId,
      status: ScrapeJobStatus.PENDING,
    });

    await this.scrapeQueue.add('scrape-job', { url: targetUrl, jobId: job.id });
    
    return { message: 'Refresh job created', jobId: job.id, success: true };
  }

  async updateJobStatus(jobId: number, status: ScrapeJobStatus, errorLog?: string) {
    const update: Partial<ScrapeJob> = { status };
    
    if (status === ScrapeJobStatus.RUNNING) {
      update.started_at = new Date();
    } else if (status === ScrapeJobStatus.DONE || status === ScrapeJobStatus.FAILED) {
      update.finished_at = new Date();
      if (errorLog) update.error_log = errorLog;
    }
    
    await this.scrapeJobRepository.update(jobId, update);
  }

  async enqueueIfStale(
    targetType: ScrapeTargetType, 
    targetUrl: string, 
    lastScrapedAt: Date | null,
    ttlHours: number
  ): Promise<boolean> {
    // Import isStale utility
    const isStaleCheck = (lastScrapedAt: Date | null, ttlHours: number): boolean => {
      if (!lastScrapedAt) return true;
      const now = new Date();
      const staleThreshold = new Date(lastScrapedAt.getTime() + ttlHours * 60 * 60 * 1000);
      return now > staleThreshold;
    };
    
    if (!isStaleCheck(lastScrapedAt, ttlHours)) {
      return false;
    }

    // Check for existing pending job
    const existingJob = await this.scrapeJobRepository.findOne({
      where: { target_url: targetUrl, status: ScrapeJobStatus.PENDING },
    });

    if (existingJob) {
      return true; // Already queued
    }

    // Create and enqueue
    const job = await this.scrapeJobRepository.save({
      target_type: targetType,
      target_url: targetUrl,
      status: ScrapeJobStatus.PENDING,
    });

    await this.scrapeQueue.add('scrape-job', { url: targetUrl, jobId: job.id });
    this.logger.log(`Enqueued stale ${targetType} scrape for ${targetUrl}`);
    
    return true;
  }

  async scrapeData(startUrl: string) {
    this.logger.log(`Starting scrape for ${startUrl}`);
    
    const crawler = new PlaywrightCrawler({
      requestHandler: async ({ page, request, enqueueLinks, log }) => {
        log.info(`Processing ${request.url}`);

        const url = request.url;
        
        // Garbage Filter
        const isGarbage = url.includes('/pages/') || 
                          url.includes('/account') || 
                          url.includes('/cart') || 
                          url.includes('/search') || 
                          url.includes('/help') || 
                          url.includes('/about') || 
                          url.includes('#');

        if (isGarbage) {
            log.debug(`Skipping garbage URL: ${url}`);
            return;
        }

        const urlObj = new URL(url);
        const isHome = (urlObj.pathname === '/en-gb' || urlObj.pathname === '/en-gb/') && 
                       (urlObj.hostname === 'www.wob.com' || urlObj.hostname === 'www.worldofbooks.com');
        const isCategory = url.includes('/collections/');
        const matchesProductPattern = url.includes('/books/') || url.includes('/products/'); 
        const hasPrice = await page.$('.price, .product-price, .current-price');
        const hasTitle = await page.$('h1');
        const isProductPage = !isCategory && !isHome && matchesProductPattern && hasPrice && hasTitle;

        // 1. HOME / GENERAL NAVIGATION
        if (isHome || request.label === 'HOME') {
            log.info('Scraping Home/Landing Page with Mega Menu...');
            
            // Helper function to classify navigation items
            const classifyItem = (title: string, url: string): NavigationItemType => {
              if (!url || url === '#') return NavigationItemType.IGNORE;
              if (url.includes('/collections/')) return NavigationItemType.COLLECTION;
              if (url.includes('/pages/')) return NavigationItemType.PROMO;
              // Simple author detection: "FirstName LastName" pattern
              if (/^[A-Z][a-z]+ [A-Z]/.test(title)) return NavigationItemType.AUTHOR;
              return NavigationItemType.IGNORE;
            };

            // Helper function to create clean slug (no emojis)
            const createSlug = (text: string): string => {
              return text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special chars including emojis
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            };

            // Find all main navigation items (top-level nav bar only)
            // Target only direct children or top-level links, not nested mega menu links
            // Find all main navigation items (top-level nav bar only)
            // Wait for navigation to be fully loaded
            await page.waitForTimeout(3000);
            
            // Hardcoded main navigation categories for reliability and speed
            const MAIN_NAV_CATEGORIES = [
              'Clearance',
              'Fiction Books',
              'Non-Fiction Books',
              'Children\'s Books',
              'Rare Books',
              'Music & Film'
            ];

            const rawNavItems = await page.$$eval('a.header__menu-item', (links, categories) => {
              // Get only the first occurrence of each category (top-level only)
              const seen = new Set<string>();
              return links
                .map((link) => {
                  const li = link.closest('li');
                  const text = (link as HTMLElement).innerText?.trim();
                  
                  // Skip if we've already seen this text (avoids duplicates from mega menus)
                  if (seen.has(text || '')) return null;
                  seen.add(text || '');
                  
                  // Only include items from our hardcoded list
                  if (!categories.includes(text || '')) return null;
                  
                  return {
                    text: text || '',
                    href: (link as HTMLAnchorElement).href,
                    hasMegaMenu: li ? !!li.querySelector('.onstate-mega-menu__submenu') : false,
                  };
                })
                .filter((item) => item !== null);
            }, MAIN_NAV_CATEGORIES);

            // Filter nulls and cast to ensure TS knows they are navigation items
            const mainNavItems = rawNavItems.filter((item): item is { text: string; href: string; hasMegaMenu: boolean } => item !== null && item.text !== '');

            log.info(`Found ${mainNavItems.length} main navigation items: ${mainNavItems.map(i => i.text).join(', ')}`);

            // Process each main nav item
            for (const mainNavItem of mainNavItems) {
              try {
                log.info(`Processing navigation group: ${mainNavItem.text}`);

                // Hover to reveal menu
                // Target the specific link
                // We use :text-is to be specific if possible, or contains
                const navSelector = `a.header__menu-item:text-is("${mainNavItem.text}")`;
                
                // If it claims to have a mega menu, strict hover and wait
                if (mainNavItem.hasMegaMenu) {
                    await page.hover(navSelector).catch(e => log.debug(`Hover failed: ${e}`));
                    await page.waitForTimeout(1000); 
                }

                // Extract mega menu structure
                const megaMenuData = await page.evaluate((navText) => {
                  // Re-find the LI to scope the search
                  const allLinks = Array.from(document.querySelectorAll('a.header__menu-item'));
                  const link = allLinks.find(a => a.textContent?.trim() === navText);
                  const parentLi = link ? link.closest('li') : null;
                  
                  if (!parentLi) return null;

                  const megaMenu = parentLi.querySelector('.onstate-mega-menu__submenu');
                  // "Clearance" and others might not have a mega menu.
                  if (!megaMenu) return [];

                  const sections: Array<{
                    sectionTitle: string;
                    items: Array<{ title: string; url: string }>;
                  }> = [];

                  // The structure identified is: 
                  // .onstate-mega-menu__submenu -> .grid -> .links -> ul.list-menu -> li
                  // Section titles might be in various formats
                  
                  const lists = Array.from(megaMenu.querySelectorAll('ul.list-menu'));
                  
                  lists.forEach(ul => {
                      let currentSectionTitle = 'General';
                      let currentItems: Array<{ title: string; url: string }> = [];

                      const listItems = Array.from(ul.children); // direct LIs
                      
                      listItems.forEach(li => {
                          // Try multiple selectors for section headers
                          const headerDiv = li.querySelector('div.header__menu-item.caption-large') ||
                                          li.querySelector('strong.menu-title') ||
                                          li.querySelector('span.level-two__title') ||
                                          li.querySelector('.caption-large') ||
                                          li.querySelector('strong') ||
                                          li.querySelector('h3') ||
                                          li.querySelector('h4') ||
                                          li.querySelector('.menu-heading');
                          
                          // Also check if the li itself has a class indicating it's a header
                          const isHeaderLi = li.classList.contains('menu-header') || 
                                           li.classList.contains('section-header') ||
                                           li.classList.contains('list-menu__header');
                          
                          if (headerDiv || isHeaderLi) {
                              // If we have collected items for the previous section, push them
                              if (currentItems.length > 0) {
                                  sections.push({ sectionTitle: currentSectionTitle, items: currentItems });
                                  currentItems = [];
                              }
                              const headerText = headerDiv ? headerDiv.textContent?.trim() : li.textContent?.trim();
                              currentSectionTitle = headerText || 'Uncategorized';
                              return;
                          }

                          const link = li.querySelector('a');
                          if (link) {
                              const title = link.innerText?.trim();
                              const url = link.href;
                              if (title && url) {
                                  currentItems.push({ title, url });
                              }
                          }
                      });

                      // Push remaining
                      if (currentItems.length > 0) {
                          sections.push({ sectionTitle: currentSectionTitle, items: currentItems });
                      }
                  });

                  return sections;
                }, mainNavItem.text);

                // If no mega menu or empty, we still save the group (e.g. Clearance)
                const groupSlug = createSlug(mainNavItem.text);
                const navGroup = await this.navigationGroupRepository.save({
                  title: mainNavItem.text,
                  slug: groupSlug,
                  last_scraped_at: new Date(),
                }).catch(async (e) => {
                  return await this.navigationGroupRepository.findOne({ where: { slug: groupSlug } });
                });

                if (!navGroup) {
                   continue; 
                }

                // Clear existing items
                await this.navigationItemRepository.delete({ navigation_group: { id: navGroup.id } });

                if (megaMenuData && megaMenuData.length > 0) {
                     for (const section of megaMenuData) {
                        for (const item of section.items) {
                             const itemType = classifyItem(item.title, item.url);
                             if (itemType === NavigationItemType.IGNORE) continue;
                             
                             // Extract slug from URL (e.g., /collections/economics-finance -> economics-finance)
                             let itemSlug = '';
                             if (item.url && item.url.includes('/collections/')) {
                               itemSlug = item.url.split('/collections/')[1]?.split('?')[0] || '';
                             }
                             
                             // Fallback to creating slug from title if URL extraction fails
                             if (!itemSlug) {
                               itemSlug = createSlug(item.title);
                             }
                             
                             // Since we cleared, we can just save. 
                             // But catch dups just in case logic generates same slug twice in one run
                             await this.navigationItemRepository.save({
                                  navigation_group: navGroup,
                                  section: section.sectionTitle,
                                  title: item.title,
                                  slug: itemSlug,
                                  type: itemType,
                                  source_url: item.url,
                             }).catch(e => {}); 
                        }
                     }
                     log.info(`Saved navigation group: ${mainNavItem.text} with ${megaMenuData.length} sections`);
                } else {
                     log.info(`Saved navigation group: ${mainNavItem.text} (No mega menu items)`);
                }

              } catch (error) {
                log.error(`Error processing ${mainNavItem.text}: ${(error as Error).message}`);
              }
            }


            
            await enqueueLinks({
                selector: 'a[href*="/collections/"]',
                label: 'CATEGORY',
                userData: { source: 'home' }
            });
        } 
        
        // 2. CATEGORY PAGE: Scrape Product List Data
        if (isCategory || request.label === 'CATEGORY') {
            log.info(`Scraping Category: ${url}`);
            
            const categoryName = await page.title();
            const cleanName = categoryName.replace(' | World of Books', '').trim();
            const slug = url.split('/collections/')[1]?.split('?')[0] || cleanName.toLowerCase().replace(/ /g, '-');
            
            const savedCategory = await this.categoryRepository.upsert({
                name: cleanName,
                url: url,
                slug: slug
            }, ['url']).then(() => this.categoryRepository.findOne({ where: { url } }))
             .catch(e => { log.debug(`Category upsert issue: ${e.message}`); return null; });

            // Scrape Products visible on Category Page (ProductList)
            
            // Scrape Products visible on Category Page (ProductList)
            // Selectors identified via browser inspection:
            // Container: li.ais-InfiniteHits-item
            // Title: h3.card__heading
            // Price: div.price-item
            // Image: div.card__inner img

            const productItems = await page.$$eval('li.ais-InfiniteHits-item', (items) => { 
                return items.map((item) => {
                    const titleEl = item.querySelector('h3.card__heading');
                    const linkEl = item.querySelector('a');
                    const priceEl = item.querySelector('.price-item');
                    const imgEl = item.querySelector('.card__inner img');
                    
                    return {
                        title: (titleEl as HTMLElement)?.innerText?.trim(),
                        url: (linkEl as HTMLAnchorElement)?.href,
                        priceText: (priceEl as HTMLElement)?.innerText?.trim() || null,
                        imageUrl: (imgEl as HTMLImageElement)?.src || null
                    };
                }).filter((i): i is { title: string; url: string; priceText: string | null; imageUrl: string | null } => i !== null && !!i.title && !!i.url);
            });

            for (const item of productItems) {
                if (item.title && item.url) {
                     let priceValue = 0.0;
                     let currency = 'GBP';
                     if (item.priceText) {
                         const match = item.priceText.match(/([0-9.]+)/);
                         if (match) priceValue = parseFloat(match[1]);
                         if (item.priceText.includes('$')) currency = 'USD';
                         if (item.priceText.includes('€')) currency = 'EUR';
                     }

                     const sourceId = item.url; // Use URL as source_id for list items
                     
                     // Upsert ProductList
                     let existing = await this.productListRepository.findOne({ where: { source_id: sourceId }, relations: ['categories'] });
                     
                     // Upsert categories
                     let categories = existing ? existing.categories : [];
                     if (savedCategory) {
                        const hasCat = categories.some(c => c.id === savedCategory.id);
                        if (!hasCat) categories.push(savedCategory);
                     }

                     await this.productListRepository.save({
                         ...existing,
                         source_id: sourceId,
                         title: item.title,
                         price_value: priceValue,
                         currency,
                         image_url: item.imageUrl ?? undefined,
                         categories: categories,
                         last_seen_at: new Date(),
                         scraped_list_at: new Date()
                     });
                }
            }
            
            log.info(`Scraped ${productItems.length} products from ${url}`);
            
            // Handle pagination - WOB uses infinite scroll with "Load More" button
            // Try to load more products by scrolling and clicking load more
            try {
                // Scroll to bottom to trigger any lazy loading
                await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                await page.waitForTimeout(2000);
                
                // Look for "Load More" or "Show More" button
                const loadMoreButton = await page.$('button:has-text("Load More"), button:has-text("Show More"), .ais-InfiniteHits-loadMore');
                
                if (loadMoreButton) {
                    // Click load more up to 4 times to get more products (total 5 pages)
                    for (let i = 0; i < 4; i++) {
                        try {
                            await loadMoreButton.click();
                            await page.waitForTimeout(3000); // Wait for products to load
                            
                            // Scrape newly loaded products
                            const newProducts = await page.$$eval('li.ais-InfiniteHits-item', (items) => { 
                                return items.map((item) => {
                                    const titleEl = item.querySelector('h3.card__heading');
                                    const linkEl = item.querySelector('a');
                                    const priceEl = item.querySelector('.price-item');
                                    const imgEl = item.querySelector('.card__inner img');
                                    
                                    return {
                                        title: (titleEl as HTMLElement)?.innerText?.trim(),
                                        url: (linkEl as HTMLAnchorElement)?.href,
                                        priceText: (priceEl as HTMLElement)?.innerText?.trim() || null,
                                        imageUrl: (imgEl as HTMLImageElement)?.src || null
                                    };
                                }).filter((i): i is { title: string; url: string; priceText: string | null; imageUrl: string | null } => i !== null && !!i.title && !!i.url);
                            });
                            
                            log.info(`Loaded ${newProducts.length} total products after clicking load more ${i + 1} times`);
                            
                            // Save new products (avoiding duplicates)
                            for (const item of newProducts) {
                                if (item.title && item.url) {
                                    const sourceId = item.url;
                                    
                                    // Check if product was recently scraped (staleness check)
                                    const existing = await this.productListRepository.findOne({ 
                                        where: { source_id: sourceId },
                                        select: ['id', 'scraped_list_at']
                                    });
                                    
                                    // Skip if scraped within last 24 hours
                                    if (existing?.scraped_list_at) {
                                        const hoursSinceLastScrape = (Date.now() - existing.scraped_list_at.getTime()) / (1000 * 60 * 60);
                                        if (hoursSinceLastScrape < 24) {
                                            continue; // Skip this product, it's fresh
                                        }
                                    }
                                    
                                    let priceValue = 0.0;
                                    let currency = 'GBP';
                                    if (item.priceText) {
                                        const match = item.priceText.match(/([0-9.]+)/);
                                        if (match) priceValue = parseFloat(match[1]);
                                        if (item.priceText.includes('$')) currency = 'USD';
                                        if (item.priceText.includes('€')) currency = 'EUR';
                                    }
                                    
                                    // Get full existing record with relations
                                    const existingFull = await this.productListRepository.findOne({ 
                                        where: { source_id: sourceId }, 
                                        relations: ['categories'] 
                                    });
                                    
                                    let categories = existingFull ? existingFull.categories : [];
                                    if (savedCategory) {
                                        const hasCat = categories.some(c => c.id === savedCategory.id);
                                        if (!hasCat) categories.push(savedCategory);
                                    }
                                    
                                    await this.productListRepository.save({
                                        ...existingFull,
                                        source_id: sourceId,
                                        title: item.title,
                                        price_value: priceValue,
                                        currency,
                                        image_url: item.imageUrl ?? undefined,
                                        categories: categories,
                                        last_seen_at: new Date(),
                                        scraped_list_at: new Date()
                                    });
                                }
                            }
                            
                            // Check if button is still clickable
                            const isDisabled = await loadMoreButton.evaluate((btn) => (btn as HTMLButtonElement).disabled);
                            if (isDisabled) {
                                log.info('Load More button is disabled, reached end of products');
                                break;
                            }
                        } catch (clickError) {
                            log.debug(`Could not click load more: ${(clickError as Error).message}`);
                            break;
                        }
                    }
                }
            } catch (paginationError) {
                log.debug(`Pagination handling: ${(paginationError as Error).message}`);
            }
            
            // Update category last_scraped_at
            if (savedCategory) {
                await this.categoryRepository.update(savedCategory.id, { last_scraped_at: new Date() });
            }
        } 
        
        // 3. PRODUCT PAGE: Scrape Product Details
        if (isProductPage || request.label === 'PRODUCT') {
            log.info(`Scraping Product Details: ${url}`);
            
            const detailData = await page.evaluate(() => {
                const title = (document.querySelector('h1') as HTMLElement)?.innerText?.trim();
                const author = (document.querySelector('.author, [data-test="author"]') as HTMLElement)?.innerText?.trim();
                const description = (document.querySelector('.description, .product-description') as HTMLElement)?.innerText?.trim();
                const isbn = (document.querySelector('[itemprop="isbn"], .isbn') as HTMLElement)?.innerText?.trim();
                const format = (document.querySelector('.format') as HTMLElement)?.innerText?.trim();
                const pagesText = (document.querySelector('.pages') as HTMLElement)?.innerText?.trim();
                
                // Extract Price
                const priceText = document.querySelector('.price, .current-price, .product-price')?.textContent?.trim();
                let priceValue = 0.0;
                let currency = 'GBP';
                if (priceText) {
                    const match = priceText.match(/([0-9.]+)/);
                    if (match) priceValue = parseFloat(match[1]);
                    if (priceText.includes('$')) currency = 'USD';
                    if (priceText.includes('€')) currency = 'EUR';
                }

                // Extract Images (Gallery)
                const imageElements = Array.from(document.querySelectorAll('.product-gallery__image, .product-image img'));
                const imageUrls = imageElements.map(img => (img as HTMLImageElement).src).filter(src => src);
                // Fallback to og:image if no gallery found
                if (imageUrls.length === 0) {
                     const ogImage = document.querySelector('meta[property="og:image"]');
                     if (ogImage) imageUrls.push(ogImage.getAttribute('content') || '');
                }

                // Extract Publisher & Date
                let publisher = '';
                let publicationDate = '';
                const detailItems = Array.from(document.querySelectorAll('.product-details li, .biblio-info li'));
                detailItems.forEach(item => {
                    const text = item.textContent || '';
                    if (text.includes('Publisher:')) publisher = text.replace('Publisher:', '').trim();
                    if (text.includes('Published:')) publicationDate = text.replace('Published:', '').trim();
                });

                // Condition
                const condition = (document.querySelector('.condition, .item-condition') as HTMLElement)?.innerText?.trim();

                return {
                    title, author, description, isbn, format, pagesText, priceValue, currency, imageUrls, publisher, publicationDate, condition
                };
            });

             // Create/Find ProductList entry first
             const sourceId = url;
             let productList = await this.productListRepository.findOne({ where: { source_id: sourceId } });
             
             // If missing, create it (fallback)
             if (!productList && detailData.title) {
                 productList = await this.productListRepository.save({
                     source_id: sourceId,
                     title: detailData.title,
                     author: detailData.author,
                     price_value: detailData.priceValue,
                     currency: detailData.currency,
                     image_url: detailData.imageUrls[0],
                     publisher: detailData.publisher,
                     condition: detailData.condition,
                     last_seen_at: new Date()
                 });
             } else if (productList) {
                 // Update mutable fields
                 if (detailData.priceValue > 0) {
                    productList.price_value = detailData.priceValue;
                    productList.currency = detailData.currency;
                 }
                 if (detailData.imageUrls.length > 0 && !productList.image_url) {
                    productList.image_url = detailData.imageUrls[0];
                 }
                 if (detailData.publisher) productList.publisher = detailData.publisher;
                 if (detailData.condition) productList.condition = detailData.condition;

                 await this.productListRepository.save(productList);
             }

             if (productList) {
                 // Check if details exist
                 let details = await this.productDetailRepository.findOne({ where: { product_list: { id: productList.id } } });
                 
                 await this.productDetailRepository.save({
                     ...details,
                     product_list: productList,
                     isbn: detailData.isbn,
                     long_description: detailData.description,
                     format: detailData.format,
                     full_image_urls: detailData.imageUrls,
                     publication_date: detailData.publicationDate ? new Date(detailData.publicationDate) : undefined,
                     scraped_detail_at: new Date()
                 });
                 log.info(`Updated details for ${productList.title}`);
             }
        }
      },
      failedRequestHandler: ({ request, error, log }) => {
          log.error(`Request ${request.url} failed: ${(error as Error).message}`);
      },
      preNavigationHooks: [
          async ({ page }) => {
              await page.route('**/*.{png,jpg,jpeg,gif,webp,woff,woff2}', (route) => route.abort());
          },
      ],
      requestHandlerTimeoutSecs: 180,
      headless: true,
      maxRequestsPerCrawl: 50, // Reduced for safety/speed in demo
    });

    try {
        this.logger.log(`Running crawler for: ${startUrl}`);
        await crawler.run([startUrl]);
    } catch (error) {
        this.logger.error('Crawler failed to run:', error);
    }
  }
}
