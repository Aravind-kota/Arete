import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ScrapeTargetType } from '../../database/entities/scrape-job.entity';

export class RefreshScrapeDto {
  @IsEnum(ScrapeTargetType)
  targetType: ScrapeTargetType;

  @IsString()
  @IsOptional()
  targetId?: string;

  @IsString()
  @IsOptional()
  targetUrl?: string;
}
