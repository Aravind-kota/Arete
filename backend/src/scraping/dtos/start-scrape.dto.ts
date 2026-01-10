import { IsUrl, IsOptional } from 'class-validator';

export class StartScrapeDto {
  @IsUrl()
  @IsOptional()
  url?: string;
}
