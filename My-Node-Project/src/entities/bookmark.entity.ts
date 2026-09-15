import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique
} from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';
import { Chapter } from './chapter.entity';

@Entity('bookmarks')
@Unique('uk_user_novel_bookmark', ['user_id', 'novel_id'])
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_bookmarks_user')
  @Column({ type: 'int' })
  user_id: number;

  @Index('idx_bookmarks_novel')
  @Column({ type: 'int' })
  novel_id: number;

  @Column({ type: 'int', nullable: true })
  last_chapter_id: number | null;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.bookmarks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Novel, (novel) => novel.bookmarks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @ManyToOne(() => Chapter, (chapter) => chapter.bookmarks, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true
  })
  @JoinColumn({ name: 'last_chapter_id' })
  last_chapter: Chapter | null;
}
