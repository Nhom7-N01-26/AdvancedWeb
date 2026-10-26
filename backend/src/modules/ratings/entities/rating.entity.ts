import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { NovelEntity } from '../../novels/entities/novel.entity';

@Entity('ratings')
@Unique('uk_user_novel_rating', ['user_id', 'novel_id'])
export class RatingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'novel_id' })
  novel_id: number;

  @ManyToOne(() => NovelEntity, (novel) => novel.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: NovelEntity;

  @Column({ type: 'tinyint' })
  score: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
