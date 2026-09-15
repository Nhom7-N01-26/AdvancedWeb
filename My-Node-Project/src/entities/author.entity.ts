import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index
} from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  user_id: number;

  @Index('idx_authors_pen_name')
  @Column({ type: 'varchar', length: 100 })
  pen_name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'int', default: 0 })
  total_novels: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToOne(() => User, (user) => user.author, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Novel, (novel) => novel.author)
  novels: Novel[];
}
