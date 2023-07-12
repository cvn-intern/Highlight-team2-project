import { Controller } from '@nestjs/common';
import { UserwordService } from './userword.service';

@Controller('userword')
export class UserwordController {
    constructor(
        private userWordService: UserwordService,
    ) {}
}
