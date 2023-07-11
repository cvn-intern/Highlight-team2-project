import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    avatar: string;

    @Column({nullable: false})
    nickname: string;

    @Column({nullable: false, default: false})
    is_guest: boolean;

    @Column({
        type: 'enum',
        enum: ['facebook', 'google'],
        nullable: true,
    })
    provider: string;

    @Column({nullable: true})
    id_provider: string;

    @Column({type: 'timestamp', default: 'now()'})
    created_at: Date;

    @Column({type: 'timestamp', default: 'now()'})
    updated_at: Date;
}