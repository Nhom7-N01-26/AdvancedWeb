import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';
import { Chapter } from './chapter.entity';

@Entity('reading_history')
export class ReadingHistory {
  @PrimaryGeneratedColumn() id: number;
  @Column() user_id: number;
  @Column() novel_id: number;
  @Column() chapter_id: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) progress_percent: number;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) read_at: Date;
  @ManyToOne(() => User, (user) => user.reading_histories) @JoinColumn({ name: 'user_id' }) user: User;
  @ManyToOne(() => Novel, (novel) => novel.reading_histories) @JoinColumn({ name: 'novel_id' }) novel: Novel;
  @ManyToOne(() => Chapter, (chapter) => chapter.reading_histories) @JoinColumn({ name: 'chapter_id' }) chapter: Chapter;
}