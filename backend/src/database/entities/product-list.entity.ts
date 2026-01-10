import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { Category } from './category.entity';
import { ProductDetail } from './product-detail.entity';

@Entity('products_list')
export class ProductList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  source_id: string;

  @Column({ unique: true, nullable: true })
  source_url: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price_value: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  binding_type: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  condition: string;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @OneToOne(() => ProductDetail, (detail) => detail.product_list)
  product_detail: ProductDetail;

  @Column({ type: 'timestamptz', nullable: true })
  last_seen_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  scraped_list_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
