import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ScrapeTargetType {
  NAVIGATION = 'navigation',
  CATEGORY = 'category',
  PRODUCT = 'product',
}

export enum ScrapeJobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  DONE = 'done',
  FAILED = 'failed',
}

@Entity('scrape_jobs')
export class ScrapeJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ScrapeTargetType })
  target_type: ScrapeTargetType;

  @Column()
  target_url: string;

  @Column({ nullable: true })
  target_id: string;

  @Column({ type: 'enum', enum: ScrapeJobStatus, default: ScrapeJobStatus.PENDING })
  status: ScrapeJobStatus;

  @Column({ type: 'timestamptz', nullable: true })
  started_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finished_at: Date;

  @Column({ type: 'text', nullable: true })
  error_log: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
