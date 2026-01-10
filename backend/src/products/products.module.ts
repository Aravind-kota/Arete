import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductList } from '../database/entities/product-list.entity';
import { ProductDetail } from '../database/entities/product-detail.entity';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductList, ProductDetail]),
    forwardRef(() => ScrapingModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
