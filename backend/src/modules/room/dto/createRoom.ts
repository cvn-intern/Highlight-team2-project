import { IsNotEmpty } from 'class-validator';

export class CreateRoomDTO {
  @IsNotEmpty()
  max_player: number;

  @IsNotEmpty()
  theme: number;

  @IsNotEmpty()
  number_of_round: number;

  @IsNotEmpty()
  time_per_round: number;

  @IsNotEmpty()
  language: string;

  @IsNotEmpty()
  is_public: boolean;

  @IsNotEmpty()
  thumbnail: string;
}
