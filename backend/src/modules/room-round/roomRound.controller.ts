import { Controller } from '@nestjs/common';
import { RoomRoundService } from './roomRound.service';

@Controller('room-round')
export class RoomRoundController {
  constructor(private roomRoundService: RoomRoundService) {}
}
