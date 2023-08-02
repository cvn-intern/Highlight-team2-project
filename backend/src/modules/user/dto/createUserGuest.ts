import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserGuestDTO {
  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  @Length(2, 20)
  nickname: string;

  @IsNotEmpty()
  language: string;
}
