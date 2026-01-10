import { Controller, Post, Body } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { StartScrapeDto } from './dtos/start-scrape.dto';
import { RefreshScrapeDto } from './dtos/refresh-scrape.dto';

@Controller('scrape')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('start')
  async startScraping(@Body() dto: StartScrapeDto) {
    return this.scrapingService.startScrape(dto.url);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshScrapeDto) {
    return this.scrapingService.refreshTarget(dto);
  }
}
