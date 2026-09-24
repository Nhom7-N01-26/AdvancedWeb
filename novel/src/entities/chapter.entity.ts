import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Novel } from './novel.entity';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';
import { ReadingHistory } from './reading-history.entity';

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn() id: number;
  @Column() novel_id: number;
  @Column() chapter_number: number;
  @Column({ length: 255 }) title: string;
  @Column({ type: 'text' }) content: string;
  @Column({ default: 0 }) word_count: number;
  @Column({ default: 0 }) views: number;
  @Column({ type: 'simple-enum', enum: ['draft', 'published'], default: 'draft' }) status: 'draft' | 'published';
  @Column({ type: 'datetime', nullable: true }) published_at: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;
  @ManyToOne(() => Novel, (novel) => novel.chapters) @JoinColumn({ name: 'novel_id' }) novel: Novel;
  @OneToMany(() => Comment, (comment) => comment.chapter) comments: Comment[];
  @OneToMany(() => Bookmark, (bookmark) => bookmark.last_chapter) bookmarks: Bookmark[];
  @OneToMany(() => ReadingHistory, (history) => history.chapter) reading_histories: ReadingHistory[];
}