import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Chapter } from './chapter.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn() id: number;
  @Column() user_id: number;
  @Column() chapter_id: number;
  @Column({ nullable: true }) parent_id: number | null;
  @Column({ type: 'text' }) content: string;
  @Column({ default: 0 }) likes: number;
  @Column({ default: false }) is_edited: boolean;
  @Column({ default: false }) is_hidden: boolean;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;
  @ManyToOne(() => User, (user) => user.comments) @JoinColumn({ name: 'user_id' }) user: User;
  @ManyToOne(() => Chapter, (chapter) => chapter.comments) @JoinColumn({ name: 'chapter_id' }) chapter: Chapter;
  @ManyToOne(() => Comment, (comment) => comment.replies) @JoinColumn({ name: 'parent_id' }) parent: Comment | null;
  @OneToMany(() => Comment, (comment) => comment.parent) replies: Comment[];
}