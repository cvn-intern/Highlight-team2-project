import { IsNotEmpty, Length } from 'class-validator';

export class CreateThemeDTO {
  @IsNotEmpty()
  @Length(2)
  name: string;

  @IsNotEmpty()
  thumbnail: string;
}
