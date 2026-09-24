import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';
import { Chapter } from './chapter.entity';

@Entity('bookmarks')
@Unique(['user', 'novel'])
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookmarks, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Novel, (novel) => novel.bookmarks, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @ManyToOne(() => Chapter, (chapter) => chapter.lastBookmarks, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_chapter_id' })
  lastChapter: Chapter | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
