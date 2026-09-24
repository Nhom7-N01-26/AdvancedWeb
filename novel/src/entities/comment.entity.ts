import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Chapter } from './chapter.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Chapter, (chapter) => chapter.comments, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ name: 'is_edited', default: false })
  isEdited: boolean;

  @Column({ name: 'is_hidden', default: false })
  isHidden: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
