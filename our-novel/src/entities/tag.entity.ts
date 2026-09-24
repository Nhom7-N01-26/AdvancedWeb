import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Novel } from './novel.entity';

@Entity('tags')
@Unique(['name'])
@Unique(['slug'])
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  name: string;

  @Column({ length: 100 })
  slug: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @ManyToMany(() => Novel, (novel) => novel.tags)
  novels: Novel[];
}
