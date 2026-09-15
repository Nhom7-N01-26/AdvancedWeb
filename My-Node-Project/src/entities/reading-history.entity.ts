import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  Check
} from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';
import { Chapter } from './chapter.entity';

@Entity('reading_history')
@Unique('uk_user_chapter_history', ['user_id', 'chapter_id'])
@Check('chk_progress', '`progress_percent` >= 0 AND `progress_percent` <= 100')
export class ReadingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_rh_user')
  @Column({ type: 'int' })
  user_id: number;

  @Index('idx_rh_novel')
  @Column({ type: 'int' })
  novel_id: number;

  @Column({ type: 'int' })
  chapter_id: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0.0
  })
  progress_percent: number;

  @Index('idx_rh_read_at')
  @CreateDateColumn({ type: 'datetime' })
  read_at: Date;

  @ManyToOne(() => User, (user) => user.reading_histories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Novel, (novel) => novel.reading_histories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @ManyToOne(() => Chapter, (chapter) => chapter.reading_histories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;
}
