import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';
import { Chapter } from './chapter.entity';

@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn() id: number;
  @Column() user_id: number;
  @Column() novel_id: number;
  @Column({ nullable: true }) last_chapter_id: number | null;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @ManyToOne(() => User, (user) => user.bookmarks) @JoinColumn({ name: 'user_id' }) user: User;
  @ManyToOne(() => Novel, (novel) => novel.bookmarks) @JoinColumn({ name: 'novel_id' }) novel: Novel;
  @ManyToOne(() => Chapter, (chapter) => chapter.bookmarks) @JoinColumn({ name: 'last_chapter_id' }) last_chapter: Chapter | null;
}