import { IsIn, IsNotEmpty, Length } from "class-validator";

export class CreateUserProviderDTO {
  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  @Length(2, 20)
  nickname: string;

  @IsNotEmpty()
  language: string;

  @IsNotEmpty()
  @IsIn(['facebook', 'google'])
  provider: string;

  @IsNotEmpty()
  id_provider: string;
}