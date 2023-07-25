import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Entity('roomuser')
export class RoomUser {
  @PrimaryColumn()
  @ManyToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room_id: number;

  @PrimaryColumn()
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column({ default: 0 })
  score: number;

  @Column({ type: 'timestamp', nullable: true })
  answered_at: Date;
}
