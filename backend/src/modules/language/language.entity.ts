import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('language')
export class Language {
  @PrimaryColumn()
  code: string;

  @Column({ nullable: false })
  name: string;
}
