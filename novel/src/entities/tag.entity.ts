import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Novel } from './novel.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 80, unique: true }) name: string;
  @Column({ length: 100, unique: true }) slug: string;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @ManyToMany(() => Novel, (novel) => novel.tags) novels: Novel[];
}