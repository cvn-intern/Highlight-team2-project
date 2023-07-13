import { Controller } from '@nestjs/common';
import { RoomRoundService } from './roomRound.service';

@Controller('roomround')
export class RoomRoundController {
    constructor(
        private roomRoundService: RoomRoundService,
    ) {}
}
