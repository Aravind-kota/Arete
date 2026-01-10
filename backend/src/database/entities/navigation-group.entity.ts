import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('navigation_group')
export class NavigationGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany('NavigationItem', (item: any) => item.navigation_group)
  items: any[];

  @Column({ type: 'timestamptz', nullable: true })
  last_scraped_at: Date;
}
