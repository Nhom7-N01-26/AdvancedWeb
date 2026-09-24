import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Author } from './author.entity';
import { Comment } from './comment.entity';
import { Rating } from './rating.entity';
import { Bookmark } from './bookmark.entity';
import { ReadingHistory } from './reading-history.entity';

export enum UserRole {
  ADMIN = 'admin',
  AUTHOR = 'author',
  READER = 'reader',
}

@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 100 })
  email: string;

  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.READER })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToOne(() => Author, (author) => author.user)
  author: Author;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => ReadingHistory, (history) => history.user)
  readingHistory: ReadingHistory[];
}
