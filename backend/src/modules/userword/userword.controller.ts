import { Controller } from '@nestjs/common';
import { UserwordService } from './userWord.service';

@Controller('userword')
export class UserWordController {
    constructor(
        private userWordService: UserwordService,
    ) {}
}
