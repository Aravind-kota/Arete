import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { ScrapingService } from './scraping.service';
import { ScrapeJobStatus } from '../database/entities/scrape-job.entity';

@Processor('scrape')
export class ScrapeProcessor {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Process('scrape-job')
  async handleScrape(job: Job<{ url: string; jobId?: number }>) {
    console.log('Processing job...', job.id);
    
    const { url, jobId } = job.data;
    
    // Update job status to running
    if (jobId) {
      await this.scrapingService.updateJobStatus(jobId, ScrapeJobStatus.RUNNING);
    }
    
    try {
      await this.scrapingService.scrapeData(url);
      
      // Mark job as done
      if (jobId) {
        await this.scrapingService.updateJobStatus(jobId, ScrapeJobStatus.DONE);
      }
      console.log('Job completed', job.id);
    } catch (error) {
      // Mark job as failed
      if (jobId) {
        await this.scrapingService.updateJobStatus(
          jobId, 
          ScrapeJobStatus.FAILED, 
          (error as Error).message
        );
      }
      console.error('Job failed', job.id, error);
      throw error;
    }
  }
}
