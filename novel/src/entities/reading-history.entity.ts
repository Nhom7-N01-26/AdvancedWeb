import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';
import { Chapter } from './chapter.entity';

@Entity('reading_history')
@Unique(['user', 'chapter'])
export class ReadingHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.readingHistory, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Novel, (novel) => novel.readingHistory, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @ManyToOne(() => Chapter, (chapter) => chapter.readingHistory, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;

  @Column({ name: 'progress_percent', type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercent: string;

  @Column({ name: 'read_at', type: 'datetime' })
  readAt: Date;
}
