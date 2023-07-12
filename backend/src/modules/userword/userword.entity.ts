import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Language } from "../language/language.entity";
import { Theme } from "../theme/theme.entity";
import { User } from "../user/user.entity";

@Entity('userword')
export class UserWord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    word: string;

    @ManyToOne(() => Theme, (theme) => theme.id)
    @JoinColumn({name: 'theme'})
    theme: number;

    @ManyToOne(() => Language, (language) => language.code)
    @JoinColumn({name: 'source_language'})
    source_language: string;

    @Column({
        type: 'enum',
        enum: [0, 1, 2],
        default: 0,
    })
    level: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'creator'})
    creator: number;

    @Column({type: 'timestamp', default: 'now()'})
    created_at: Date;

    @Column({type: 'timestamp', default: 'now()'})
    updated_at: Date;
}