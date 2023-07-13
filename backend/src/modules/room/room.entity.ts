import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Theme } from "../theme/theme.entity";
import { User } from "../user/user.entity";
import { Language } from "../language/language.entity";

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  code_room: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({name: 'host'})
  host: number;

  @ManyToOne(() => Theme, (theme) => theme.id)
  @JoinColumn({name: 'theme'})
  theme: number;

  @Column({nullable: true})
  max_player: number;

  @Column({nullable: false})
  time_per_round: number;

  @Column({nullable: false})
  number_of_round: number;

  @Column({nullable: false})
  thumbnail: string;

  @ManyToOne(() => Language, (language) => language.code)
  @JoinColumn({name: 'language'})
  language: string;

  @Column({default: true})
  is_public: boolean; // false: private, true: public

  @Column({type: 'timestamp', default: 'now()'})
  created_at: Date;

  @Column({type: 'timestamp', default: 'now()'})
  updated_at: Date;
}
