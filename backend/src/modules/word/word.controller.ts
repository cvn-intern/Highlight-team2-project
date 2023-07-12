import { Controller } from '@nestjs/common';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
    constructor(
        private wordService: WordService,
    ) {}
}
