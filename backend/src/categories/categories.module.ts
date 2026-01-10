import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../database/entities/category.entity';
import { Navigation } from '../database/entities/navigation.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Navigation]),
    forwardRef(() => ScrapingModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
