import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WordsCollection } from '../words-collection/wordsCollection.entity';
import { User } from '../user/user.entity';

@Entity('word')
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  word: string;

  @Column({
    type: 'enum',
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  })
  difficulty: string;

  @ManyToOne(() => WordsCollection, (wordsCollection) => wordsCollection.id)
  @JoinColumn({ name: 'words_collection_id' })
  words_collection_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'creator_id' })
  creator_id: number;
}
