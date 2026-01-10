import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ProductList } from './product-list.entity';

@Entity('product_details')
export class ProductDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ProductList, (list) => list.product_detail)
  @JoinColumn({ name: 'product_list_id' })
  product_list: ProductList;

  @Column({ nullable: true })
  isbn: string;

  @Column({ type: 'text', nullable: true })
  long_description: string;

  @Column({ nullable: true })
  format: string;

  @Column({ type: 'int', nullable: true })
  pages: number;

  @Column({ type: 'date', nullable: true })
  publication_date: Date;

  @Column({ type: 'float', nullable: true })
  rating_avg: number;

  @Column({ type: 'int', nullable: true })
  reviews_count: number;

  // Storing array of strings as simple-array for simplicity in Postgres
  @Column({ type: 'simple-array', nullable: true })
  full_image_urls: string[];

  @Column({ type: 'timestamptz', nullable: true })
  scraped_detail_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
