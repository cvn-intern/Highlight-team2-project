import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('theme')
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  thumbnail: string;
}
