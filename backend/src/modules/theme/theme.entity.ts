import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from '../language/language.entity';

@Entity('theme')
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  thumbnail: string;

  @ManyToOne(() => Language, (language) => language.code)
  @JoinColumn({ name: 'language_code' })
  @Column({ default: 'en' })
  language_code: string;
}
