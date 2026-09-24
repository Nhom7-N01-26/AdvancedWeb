import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';

@Entity('authors')
@Unique(['user'])
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.author, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'pen_name', length: 100 })
  penName: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string | null;

  @Column({ name: 'total_novels', default: 0 })
  totalNovels: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => Novel, (novel) => novel.author)
  novels: Novel[];
}
