import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  Index
} from 'typeorm';
import { Novel } from './novel.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 80, unique: true })
  name: string;

  @Index('idx_tags_slug')
  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @ManyToMany(() => Novel, (novel) => novel.tags)
  novels: Novel[];
}
