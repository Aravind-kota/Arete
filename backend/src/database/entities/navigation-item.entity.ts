import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NavigationGroup } from './navigation-group.entity';

export enum NavigationItemType {
  COLLECTION = 'COLLECTION',
  PROMO = 'PROMO',
  AUTHOR = 'AUTHOR',
  IGNORE = 'IGNORE',
}

@Entity('navigation_item')
export class NavigationItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NavigationGroup, (group) => group.items)
  navigation_group: NavigationGroup;

  @Column()
  section: string; // e.g., "By Category", "Special Features", "Top Authors"

  @Column()
  title: string; // e.g., "Crime & Mystery", "Trending Books", "Stephen King"

  @Column({ unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: NavigationItemType,
    default: NavigationItemType.COLLECTION,
  })
  type: NavigationItemType;

  @Column()
  source_url: string;
}
