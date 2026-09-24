import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Author } from './author.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Chapter } from './chapter.entity';
import { Rating } from './rating.entity';
import { Bookmark } from './bookmark.entity';
import { ReadingHistory } from './reading-history.entity';

@Entity('novels')
export class Novel {
  @PrimaryGeneratedColumn() id: number;
  @Column() author_id: number;
  @Column({ length: 255 }) title: string;
  @Column({ length: 280, unique: true }) slug: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ length: 500, nullable: true }) cover_image: string;
  @Column({ type: 'simple-enum', enum: ['draft', 'ongoing', 'completed', 'hiatus'], default: 'draft' }) status: 'draft' | 'ongoing' | 'completed' | 'hiatus';
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 }) avg_rating: number;
  @Column({ default: 0 }) total_views: number;
  @Column({ default: 0 }) total_bookmarks: number;
  @Column({ default: 0 }) total_chapters: number;
  @Column({ default: 0 }) total_ratings: number;
  @Column({ default: false }) is_featured: boolean;
  @Column({ type: 'datetime', nullable: true }) published_at: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;
  @ManyToOne(() => Author, (author) => author.novels) @JoinColumn({ name: 'author_id' }) author: Author;
  @ManyToMany(() => Category, (category) => category.novels) @JoinTable() categories: Category[];
  @ManyToMany(() => Tag, (tag) => tag.novels) @JoinTable() tags: Tag[];
  @OneToMany(() => Chapter, (chapter) => chapter.novel) chapters: Chapter[];
  @OneToMany(() => Rating, (rating) => rating.novel) ratings: Rating[];
  @OneToMany(() => Bookmark, (bookmark) => bookmark.novel) bookmarks: Bookmark[];
  @OneToMany(() => ReadingHistory, (history) => history.novel) reading_histories: ReadingHistory[];
}