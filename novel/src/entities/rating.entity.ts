import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';

@Entity('ratings')
@Unique(['user', 'novel'])
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.ratings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Novel, (novel) => novel.ratings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @Column({ type: 'tinyint' })
  score: number;

  @Column({ type: 'text', nullable: true })
  review: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
