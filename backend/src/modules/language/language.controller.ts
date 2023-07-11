import { Controller } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
    constructor(
        private languageService: LanguageService,
    ) {}
}
