import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ScrapingModule } from './scraping/scraping.module';
import { ProductsModule } from './products/products.module';
import { NavigationModule } from './navigation/navigation.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    // 1. Load ConfigModule first as a global module
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Use forRootAsync to wait for process.env.REDIS_URL to load
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          // MANDATORY for Upstash:
          tls: {}, 
          // Set to null to allow Bull to keep trying during cold starts
          maxRetriesPerRequest: null, 
        },
      }),
    }),
    DatabaseModule,
    ScrapingModule,
    ProductsModule,
    NavigationModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}