import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Novel } from './novel.entity';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';
import { ReadingHistory } from './reading-history.entity';

export enum ChapterStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('chapters')
@Unique(['novel', 'chapterNumber'])
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Novel, (novel) => novel.chapters, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @Column({ name: 'chapter_number' })
  chapterNumber: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ name: 'word_count', default: 0 })
  wordCount: number;

  @Column({ default: 0 })
  views: number;

  @Column({ type: 'enum', enum: ChapterStatus, default: ChapterStatus.DRAFT })
  status: ChapterStatus;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.chapter)
  comments: Comment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.lastChapter)
  lastBookmarks: Bookmark[];

  @OneToMany(() => ReadingHistory, (history) => history.chapter)
  readingHistory: ReadingHistory[];
}
