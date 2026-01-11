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
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined');
        }

        const url = new URL(databaseUrl);
        
        // Render does not support IPv6, and Supabase direct connections are IPv6-only.
        // We must use the Supabase Connection Pooler (Supavisor) which supports IPv4.
        // Project Region: ap-northeast-1
        if (url.hostname.includes('supabase.co')) {
           // Replace the direct DB hostname with the IPv4-compatible pooler
           // We keep port 5432 for Session mode (compatible with TypeORM/Postgres logic)
           // or 6543 for Transaction mode. Using 5432 is safer for general compatibility unless configured otherwise.
           // For this specific project in ap-northeast-1:
           const poolerHost = 'aws-1-ap-northeast-1.pooler.supabase.com';
           if (url.hostname !== poolerHost) {
              console.log(`Swapping hostname ${url.hostname} for IPv4 pooler ${poolerHost} to support Render.`);
              url.hostname = poolerHost;
           }
        }

        return {
          type: 'postgres',
          url: url.toString(), 
          entities: [Navigation, NavigationGroup, NavigationItem, Category, ProductList, ProductDetail, ScrapeJob],
          // Supabase/Cloud providers require SSL. Use DB_SSL env var to control this.
          ssl: configService.get<string>('DB_SSL') === 'true' 
            ? { rejectUnauthorized: false } 
            : false,
          // Required to auto-create tables on Day 1 [cite: 91]
          synchronize: true, 
        };
      },
    }),
    TypeOrmModule.forFeature([Navigation, NavigationGroup, NavigationItem, Category, ProductList, ProductDetail, ScrapeJob]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}