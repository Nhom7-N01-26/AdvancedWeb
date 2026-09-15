import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique
} from 'typeorm';
import { Novel } from './novel.entity';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';
import { ReadingHistory } from './reading-history.entity';

export type ChapterStatus = 'draft' | 'published';

@Entity('chapters')
@Unique('uk_chapter_number', ['novel_id', 'chapter_number'])
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_chapters_novel')
  @Column({ type: 'int' })
  novel_id: number;

  @Column({ type: 'int' })
  chapter_number: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'int', default: 0 })
  word_count: number;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Index('idx_chapters_status')
  @Column({
    type: 'enum',
    enum: ['draft', 'published'],
    default: 'draft'
  })
  status: ChapterStatus;

  @Index('idx_chapters_published')
  @Column({ type: 'datetime', nullable: true })
  published_at: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => Novel, (novel) => novel.chapters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'novel_id' })
  novel: Novel;

  @OneToMany(() => Comment, (comment) => comment.chapter)
  comments: Comment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.last_chapter)
  bookmarks: Bookmark[];

  @OneToMany(() => ReadingHistory, (history) => history.chapter)
  reading_histories: ReadingHistory[];
}
