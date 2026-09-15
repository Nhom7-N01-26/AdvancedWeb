import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  Index
} from 'typeorm';
import { Novel } from './novel.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Index('idx_categories_slug')
  @Column({ type: 'varchar', length: 120, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string;

  @Column({ type: 'int', default: 0 })
  novel_count: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @ManyToMany(() => Novel, (novel) => novel.categories)
  novels: Novel[];
}
