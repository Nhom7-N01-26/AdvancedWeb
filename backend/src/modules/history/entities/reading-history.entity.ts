import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { NovelEntity } from '../../novels/entities/novel.entity';
import { ChapterEntity } from '../../chapters/entities/chapter.entity';

@Entity('reading_history')
@Unique('uk_user_novel_history', ['user_id', 'novel_id'])
export class ReadingHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.reading_history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'novel_id' })
  novel_id: number;

  @ManyToOne(() => NovelEntity, (novel) => novel.reading_history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: NovelEntity;

  @Column({ name: 'chapter_id' })
  chapter_id: number;

  @ManyToOne(() => ChapterEntity, (chapter) => chapter.reading_history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapter_id' })
  chapter: ChapterEntity;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  progress_percent: number;

  @CreateDateColumn()
  read_at: Date;
}
