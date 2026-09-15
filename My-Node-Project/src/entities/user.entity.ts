import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  Index
} from 'typeorm';
import { Author } from './author.entity';
import { Comment } from './comment.entity';
import { Rating } from './rating.entity';
import { Bookmark } from './bookmark.entity';
import { ReadingHistory } from './reading-history.entity';

export type UserRole = 'admin' | 'author' | 'reader';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 100 })
  full_name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Index('idx_users_role')
  @Column({
    type: 'enum',
    enum: ['admin', 'author', 'reader'],
    default: 'reader'
  })
  role: UserRole;

  @Index('idx_users_active')
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Index('idx_users_created')
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToOne(() => Author, (author) => author.user)
  author: Author;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => ReadingHistory, (history) => history.user)
  reading_histories: ReadingHistory[];
}
