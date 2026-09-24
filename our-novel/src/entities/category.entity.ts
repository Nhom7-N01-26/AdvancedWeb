import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Novel } from './novel.entity';

@Entity('categories')
@Unique(['name'])
@Unique(['slug'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 120 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string | null;

  @Column({ name: 'novel_count', default: 0 })
  novelCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @ManyToMany(() => Novel, (novel) => novel.categories)
  novels: Novel[];
}
