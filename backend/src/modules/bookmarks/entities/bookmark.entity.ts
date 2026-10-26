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

@Entity('bookmarks')
@Unique('uk_user_novel_bookmark', ['user_id', 'novel_id'])
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.bookmarks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'novel_id' })
  novel_id: number;

  @ManyToOne(() => NovelEntity, (novel) => novel.bookmarks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novel_id' })
  novel: NovelEntity;

  @Column({ name: 'last_chapter_id', nullable: true })
  last_chapter_id: number;

  @ManyToOne(() => ChapterEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_chapter_id' })
  last_chapter: ChapterEntity;

  @CreateDateColumn()
  created_at: Date;
}
