import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Entity('roomround')
export class RoomRound {
  @PrimaryColumn()
  @OneToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room_id: number;

  @Column({ nullable: false, default: 1 })
  current_round: number;

  @Column({ nullable: true })
  word: string;

  @Column({ type: 'timestamp' })
  started_at: Date;

  @Column({ type: 'timestamp' })
  ended_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'painter' })
  painter: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'next_painter' })
  next_painter: number;
}
