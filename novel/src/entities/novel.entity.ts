import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Author } from './author.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Chapter } from './chapter.entity';
import { Rating } from './rating.entity';
import { Bookmark } from './bookmark.entity';
import { ReadingHistory } from './reading-history.entity';

export enum NovelStatus {
  DRAFT = 'draft',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  HIATUS = 'hiatus',
}

@Entity('novels')
@Unique(['slug'])
export class Novel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Author, (author) => author.novels, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 280 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'cover_image', length: 500, nullable: true })
  coverImage: string | null;

  @Column({ type: 'enum', enum: NovelStatus, default: NovelStatus.DRAFT })
  status: NovelStatus;

  @Column({ name: 'avg_rating', type: 'decimal', precision: 3, scale: 2, default: 0 })
  avgRating: string;

  @Column({ name: 'total_views', default: 0 })
  totalViews: number;

  @Column({ name: 'total_bookmarks', default: 0 })
  totalBookmarks: number;

  @Column({ name: 'total_chapters', default: 0 })
  totalChapters: number;

  @Column({ name: 'total_ratings', default: 0 })
  totalRatings: number;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @ManyToMany(() => Category, (category) => category.novels)
  @JoinTable({
    name: 'novel_categories',
    joinColumn: { name: 'novel_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.novels)
  @JoinTable({
    name: 'novel_tags',
    joinColumn: { name: 'novel_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @OneToMany(() => Chapter, (chapter) => chapter.novel)
  chapters: Chapter[];

  @OneToMany(() => Rating, (rating) => rating.novel)
  ratings: Rating[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.novel)
  bookmarks: Bookmark[];

  @OneToMany(() => ReadingHistory, (history) => history.novel)
  readingHistory: ReadingHistory[];
}
