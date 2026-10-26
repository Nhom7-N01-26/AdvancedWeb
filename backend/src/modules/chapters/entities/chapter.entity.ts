import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ChapterStatus } from '../../../common/enums';
import { NovelEntity } from '../../novels/entities/novel.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { ReadingHistoryEntity } from '../../history/entities/reading-history.entity';

@Entity('chapters')
@Unique('uk_chapter_number', ['novel_id', 'chapter_number'])
export class ChapterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'novel_id' })
  novel_id: number;

  @ManyToOne(() => NovelEntity, (novel) => novel.chapters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: NovelEntity;

  @Column()
  chapter_number: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ default: 0 })
  word_count: number;

  @Column({ default: 0 })
  views: number;

  @Column({
    type: 'enum',
    enum: ChapterStatus,
    default: ChapterStatus.DRAFT,
  })
  status: ChapterStatus;

  @Column({ type: 'datetime', nullable: true })
  published_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CommentEntity, (comment) => comment.chapter)
  comments: CommentEntity[];

  @OneToMany(() => ReadingHistoryEntity, (history) => history.chapter)
  reading_history: ReadingHistoryEntity[];
}
