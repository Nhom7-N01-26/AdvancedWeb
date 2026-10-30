import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../../common/enums';
import { AuthorEntity } from '../../authors/entities/author.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';
import { RatingEntity } from '../../ratings/entities/rating.entity';
import { BookmarkEntity } from '../../bookmarks/entities/bookmark.entity';
import { ReadingHistoryEntity } from '../../history/entities/reading-history.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  @Exclude()
  password_hash: string;

  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 500, nullable: true })
  avatar_url: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.READER,
  })
  role: UserRole;

  @Column({ default: true })
  is_active: boolean;

  @Column({ length: 255, nullable: true })
  @Exclude()
  reset_token: string;

  @Column({ type: 'datetime', nullable: true })
  reset_token_expires: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => AuthorEntity, (author) => author.user)
  author: AuthorEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.user)
  ratings: RatingEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user)
  bookmarks: BookmarkEntity[];

  @OneToMany(() => ReadingHistoryEntity, (history) => history.user)
  reading_history: ReadingHistoryEntity[];
}
