import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  Check
} from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';

@Entity('ratings')
@Unique('uk_user_novel_rating', ['user_id', 'novel_id'])
@Check('chk_rating_score', '`score` >= 1 AND `score` <= 5')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Index('idx_ratings_novel')
  @Column({ type: 'int' })
  novel_id: number;

  @Index('idx_ratings_score')
  @Column({ type: 'tinyint' })
  score: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.ratings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Novel, (novel) => novel.ratings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;
}
