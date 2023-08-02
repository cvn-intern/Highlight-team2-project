import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Theme } from '../theme/theme.entity';
import { User } from '../user/user.entity';
import { Language } from '../language/language.entity';

@Entity('words_collection')
export class WordsCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Theme, (theme) => theme.id)
  @JoinColumn({ name: 'theme_id' })
  @Column()
  theme_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'creator_id' })
  @Column({ default: null })
  creator_id: number;

  @ManyToOne(() => Language, (language) => language.code)
  @JoinColumn({ name: 'language_code' })
  @Column()
  language_code: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_created_by_system: boolean;

  @Column({ type: 'timestamp', default: 'now()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: 'now()' })
  updated_at: Date;
}
