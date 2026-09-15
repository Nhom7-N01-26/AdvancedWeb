import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index
} from 'typeorm';
import { User } from './user.entity';
import { Chapter } from './chapter.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_comments_user')
  @Column({ type: 'int' })
  user_id: number;

  @Index('idx_comments_chapter')
  @Column({ type: 'int' })
  chapter_id: number;

  @Index('idx_comments_parent')
  @Column({ type: 'int', nullable: true })
  parent_id: number | null;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'boolean', default: false })
  is_edited: boolean;

  @Column({ type: 'boolean', default: false })
  is_hidden: boolean;

  @Index('idx_comments_created')
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Chapter, (chapter) => chapter.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];
}
