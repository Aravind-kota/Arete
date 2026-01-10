import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Navigation } from './entities/navigation.entity';
import { NavigationGroup } from './entities/navigation-group.entity';
import { NavigationItem } from './entities/navigation-item.entity';
import { Category } from './entities/category.entity';
import { ProductList } from './entities/product-list.entity';
import { ProductDetail } from './entities/product-detail.entity';
import { ScrapeJob } from './entities/scrape-job.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // Use the pooled DATABASE_URL from your .env
        url: configService.get<string>('DATABASE_URL'), 
        entities: [Navigation, NavigationGroup, NavigationItem, Category, ProductList, ProductDetail, ScrapeJob],
        // Supabase requires SSL [cite: 69]
        ssl: {
          rejectUnauthorized: false,
        },
        // Required to auto-create tables on Day 1 [cite: 91]
        synchronize: true, 
      }),
    }),
    TypeOrmModule.forFeature([Navigation, NavigationGroup, NavigationItem, Category, ProductList, ProductDetail, ScrapeJob]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}