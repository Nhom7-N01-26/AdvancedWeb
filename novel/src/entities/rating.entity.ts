import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Novel } from './novel.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn() id: number;
  @Column() user_id: number;
  @Column() novel_id: number;
  @Column() score: number;
  @Column({ type: 'text', nullable: true }) review: string;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) created_at: Date;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) updated_at: Date;
  @ManyToOne(() => User, (user) => user.ratings) @JoinColumn({ name: 'user_id' }) user: User;
  @ManyToOne(() => Novel, (novel) => novel.ratings) @JoinColumn({ name: 'novel_id' }) novel: Novel;
}