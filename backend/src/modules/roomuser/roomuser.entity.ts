import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Room } from "../room/room.entity";
import { User } from "../user/user.entity";

@Entity('roomuser')
export class RoomUser {
    @PrimaryColumn()
    @ManyToOne(() => Room, (room) => room.id)
    @JoinColumn({name: 'id_room'})
    id_room: number;

    @PrimaryColumn()
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'id_user'})
    id_user: number;

    @Column({default: 0})
    score: number;

    @Column({type: 'timestamp', nullable: true})
    answered_at: number;
}