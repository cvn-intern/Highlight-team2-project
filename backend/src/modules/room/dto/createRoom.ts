import { IsNotEmpty } from 'class-validator';

export class CreateRoomDTO {
  @IsNotEmpty()
  max_player: number;

  @IsNotEmpty()
  words_collection_id: number;

  @IsNotEmpty()
  number_of_round: number;

  @IsNotEmpty()
  time_per_round: number;

  @IsNotEmpty()
  is_public: boolean;
}
