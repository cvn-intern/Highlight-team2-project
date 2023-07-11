import { Controller } from '@nestjs/common';
import { ThemeService } from './theme.service';

@Controller('theme')
export class ThemeController {
    constructor(
        private themeService: ThemeService,
    ) {}
}
