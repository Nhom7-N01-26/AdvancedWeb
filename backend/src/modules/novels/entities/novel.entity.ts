import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { NovelStatus } from '../../../common/enums';
import { AuthorEntity } from '../../authors/entities/author.entity';
import { ChapterEntity } from '../../chapters/entities/chapter.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { TagEntity } from '../../tags/entities/tag.entity';
import { RatingEntity } from '../../ratings/entities/rating.entity';
import { BookmarkEntity } from '../../bookmarks/entities/bookmark.entity';
import { ReadingHistoryEntity } from '../../history/entities/reading-history.entity';

@Entity('novels')
export class NovelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id' })
  author_id: number;

  @ManyToOne(() => AuthorEntity, (author) => author.novels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: AuthorEntity;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true, length: 280 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  cover_image: string;

  @Column({
    type: 'enum',
    enum: NovelStatus,
    default: NovelStatus.DRAFT,
  })
  status: NovelStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  avg_rating: number;

  @Column({ default: 0 })
  total_views: number;

  @Column({ default: 0 })
  total_bookmarks: number;

  @Column({ default: 0 })
  total_chapters: number;

  @Column({ default: 0 })
  total_ratings: number;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ type: 'datetime', nullable: true })
  published_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ChapterEntity, (chapter) => chapter.novel, { cascade: true })
  chapters: ChapterEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.novels)
  @JoinTable({
    name: 'novel_categories',
    joinColumn: { name: 'novel_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: CategoryEntity[];

  @ManyToMany(() => TagEntity, (tag) => tag.novels)
  @JoinTable({
    name: 'novel_tags',
    joinColumn: { name: 'novel_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: TagEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.novel)
  ratings: RatingEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.novel)
  bookmarks: BookmarkEntity[];

  @OneToMany(() => ReadingHistoryEntity, (history) => history.novel)
  reading_history: ReadingHistoryEntity[];
}
