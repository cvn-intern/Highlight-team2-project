import { Controller } from '@nestjs/common';
import { RoomroundService } from './roomround.service';

@Controller('roomround')
export class RoomroundController {
    constructor(
        private roomRoundService: RoomroundService,
    ) {}
}
