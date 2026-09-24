import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true }) username: string;
  @Column({ length: 100, unique: true }) email: string;
  @Column({ length: 255 }) password_hash: string;
  @Column({ length: 100 }) full_name: string;
  @Column({ length: 500, nullable: true }) avatar_url: string;
  @Column({ type: 'simple-enum', enum: ['admin', 'author', 'reader'], default: 'reader' }) role: 'admin' | 'author' | 'reader';
  @Column({ default: true }) is_active: boolean;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;

  @OneToOne(() => Author, (author) => author.user) author: Author;
  @OneToMany(() => Comment, (comment) => comment.user) comments: Comment[];
  @OneToMany(() => Rating, (rating) => rating.user) ratings: Rating[];
  @OneToMany(() => Bookmark, (bookmark) => bookmark.user) bookmarks: Bookmark[];
  @OneToMany(() => ReadingHistory, (history) => history.user) reading_histories: ReadingHistory[];
}

import { Author } from './author.entity';
import { Bookmark } from './bookmark.entity';
import { Comment } from './comment.entity';
import { Rating } from './rating.entity';
import { ReadingHistory } from './reading-history.entity';