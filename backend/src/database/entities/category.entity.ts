import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { ProductList } from './product-list.entity';
import { Navigation } from './navigation.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  url: string;

  @Column({ nullable: true })
  slug: string;

  @ManyToOne(() => Navigation, (navigation) => navigation.categories, { nullable: true })
  navigation: Navigation;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @ManyToMany(() => ProductList, (product) => product.categories)
  products: ProductList[];

  @Column({ type: 'timestamptz', nullable: true })
  last_scraped_at: Date;
}
