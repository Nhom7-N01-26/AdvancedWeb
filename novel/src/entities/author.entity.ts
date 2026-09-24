import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) user_id: number;
  @Column({ length: 100 }) pen_name: string;
  @Column({ type: 'text', nullable: true }) bio: string;
  @Column({ length: 500, nullable: true }) avatar_url: string;
  @Column({ default: 0 }) total_novels: number;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;
  @OneToOne(() => User, (user) => user.author) @JoinColumn({ name: 'user_id' }) user: User;
  @OneToMany(() => Novel, (novel) => novel.author) novels: Novel[];
}