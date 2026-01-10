import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { ScrapeProcessor } from './scrape.processor';
import { Navigation } from '../database/entities/navigation.entity';
import { NavigationGroup } from '../database/entities/navigation-group.entity';
import { NavigationItem } from '../database/entities/navigation-item.entity';
import { Category } from '../database/entities/category.entity';
import { ProductList } from '../database/entities/product-list.entity';
import { ProductDetail } from '../database/entities/product-detail.entity';
import { ScrapeJob } from '../database/entities/scrape-job.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'scrape',
    }),
    TypeOrmModule.forFeature([Navigation, NavigationGroup, NavigationItem, Category, ProductList, ProductDetail, ScrapeJob]),
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService, ScrapeProcessor],
  exports: [ScrapingService],
})
export class ScrapingModule {}
