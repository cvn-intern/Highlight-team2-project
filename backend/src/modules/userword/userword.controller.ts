import { Controller } from '@nestjs/common';
import { UserWordService } from './userWord.service';

@Controller('userword')
export class UserWordController {
    constructor(
        private userWordService: UserWordService,
    ) {}
}
