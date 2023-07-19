import { Column, Entity, PrimaryColumn, getConnection } from "typeorm";

@Entity('language')
export class Language {
    @PrimaryColumn()
    code: string;

    @Column({nullable: false})
    name: string;
}
