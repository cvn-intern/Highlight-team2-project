import { Controller } from '@nestjs/common';
import { RoomuserService } from './roomuser.service';

@Controller('roomuser')
export class RoomuserController {
    constructor(
        private roomUserService: RoomuserService,
    ) {}
}
