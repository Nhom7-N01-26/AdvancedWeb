import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index
} from 'typeorm';
import { Author } from './author.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { Chapter } from './chapter.entity';
import { Rating } from './rating.entity';
import { Bookmark } from './bookmark.entity';
import { ReadingHistory } from './reading-history.entity';

export type NovelStatus = 'draft' | 'ongoing' | 'completed' | 'hiatus';

@Entity('novels')
export class Novel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_novels_author')
  @Column({ type: 'int' })
  author_id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index('idx_novels_slug')
  @Column({ type: 'varchar', length: 280, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cover_image: string;

  @Index('idx_novels_status')
  @Column({
    type: 'enum',
    enum: ['draft', 'ongoing', 'completed', 'hiatus'],
    default: 'draft'
  })
  status: NovelStatus;

  @Index('idx_novels_rating')
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  avg_rating: number;

  @Index('idx_novels_views')
  @Column({ type: 'int', default: 0 })
  total_views: number;

  @Column({ type: 'int', default: 0 })
  total_bookmarks: number;

  @Column({ type: 'int', default: 0 })
  total_chapters: number;

  @Column({ type: 'int', default: 0 })
  total_ratings: number;

  @Index('idx_novels_featured')
  @Column({ type: 'boolean', default: false })
  is_featured: boolean;

  @Index('idx_novels_published')
  @Column({ type: 'datetime', nullable: true })
  published_at: Date;

  @Index('idx_novels_created')
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => Author, (author) => author.novels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @ManyToMany(() => Category, (category) => category.novels)
  @JoinTable({
    name: 'novel_categories',
    joinColumn: { name: 'novel_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.novels)
  @JoinTable({
    name: 'novel_tags',
    joinColumn: { name: 'novel_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: Tag[];

  @OneToMany(() => Chapter, (chapter) => chapter.novel)
  chapters: Chapter[];

  @OneToMany(() => Rating, (rating) => rating.novel)
  ratings: Rating[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.novel)
  bookmarks: Bookmark[];

  @OneToMany(() => ReadingHistory, (history) => history.novel)
  reading_histories: ReadingHistory[];
}
