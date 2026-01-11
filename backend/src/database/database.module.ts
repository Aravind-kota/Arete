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
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined');
        }

        // Manually resolve hostname to IPv4 to avoid ENETUNREACH on Node 17+ (IPv6 preference)
        const url = new URL(databaseUrl);
        const dns = await import('dns/promises');
        try {
          // family: 4 forces IPv4
          const { address } = await dns.lookup(url.hostname, { family: 4 });
          console.log(`Resolved database host ${url.hostname} to IPv4: ${address}`);
          url.hostname = address;
        } catch (error) {
          console.error(`Failed to resolve IPv4 for ${url.hostname}, falling back to original URL. Error: ${error.message}`);
        }

        return {
          type: 'postgres',
          // Use the pooled DATABASE_URL (with resolved IP)
          url: url.toString(), 
          entities: [Navigation, NavigationGroup, NavigationItem, Category, ProductList, ProductDetail, ScrapeJob],
          // Supabase requires SSL [cite: 69]
          ssl: {
            rejectUnauthorized: false, // Essential since we are connecting via IP now
          },
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