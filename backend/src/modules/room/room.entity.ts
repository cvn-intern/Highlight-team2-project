import { AfterUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { WordsCollection } from '../words-collection/wordsCollection.entity';
import { User } from '../user/user.entity';
import { Language } from '../language/language.entity';

@Entity('room')
export class Room {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  code_room: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'host_id' })
  @Column()
  host_id: number;

  @ManyToOne(() => WordsCollection, (wordsCollection) => wordsCollection.id)
  @JoinColumn({ name: 'words_collection_id' })
  words_collection_id: number;

  @Column({ nullable: true })
  max_player: number;

  @Column({ nullable: false })
  time_per_round: number;

  @Column({ nullable: false })
  number_of_round: number;

  @Column({ nullable: false })
  thumbnail: string;

  @ManyToOne(() => Language, (language) => language.code)
  @JoinColumn({ name: 'language_code' })
  language_code: string;

  @Column({ default: true })
  is_public: boolean; // false: private, true: public

  @Column({
    type: 'enum',
    enum: [
      'interval-show-word',
      'interval-not-show-word',
      'new-turn',
      'inactive',
      'wait-for-players',
      'game-start',
      'end-game',
    ],
    default: 'wait-for-players',
    nullable: false,
  })
  status: string;

  @Column({ type: 'timestamp', default: 'now()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: 'now()' })
  updated_at: Date;

  @AfterUpdate()
  handleAfterUpdate() {
    this.updated_at = new Date();
  }
}
