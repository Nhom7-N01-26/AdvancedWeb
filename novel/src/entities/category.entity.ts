import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Novel } from './novel.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 100, unique: true }) name: string;
  @Column({ length: 120, unique: true }) slug: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ length: 100, nullable: true }) icon: string;
  @Column({ default: 0 }) novel_count: number;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @ManyToMany(() => Novel, (novel) => novel.categories) novels: Novel[];
}