import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from '../database/entities/navigation.entity';
import { NavigationGroup } from '../database/entities/navigation-group.entity';
import { NavigationItem } from '../database/entities/navigation-item.entity';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Navigation, NavigationGroup, NavigationItem]),
    forwardRef(() => ScrapingModule),
  ],
  controllers: [NavigationController],
  providers: [NavigationService],
  exports: [NavigationService],
})
export class NavigationModule {}
