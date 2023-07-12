import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Language } from "../language/language.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    avatar: string;

    @Column({nullable: false})
    nickname: string;

    @ManyToOne(() => Language, (language) => language.code)
    @JoinColumn({name: 'language'})
    language: string;

    @Column({nullable: false, default: true})
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