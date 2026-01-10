import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Navigation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  url: string;

  @ManyToOne(() => Navigation, (navigation) => navigation.children, { nullable: true })
  parent: Navigation;

  @OneToMany(() => Navigation, (navigation) => navigation.parent)
  children: Navigation[];

  @OneToMany(() => Category, (category) => category.navigation)
  categories: Category[];

  @Column({ type: 'timestamptz', nullable: true })
  last_scraped_at: Date;
}
