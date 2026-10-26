import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { NovelEntity } from '../../novels/entities/novel.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ unique: true, length: 120 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  icon: string;

  @Column({ default: 0 })
  novel_count: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => NovelEntity, (novel) => novel.categories)
  novels: NovelEntity[];
}
