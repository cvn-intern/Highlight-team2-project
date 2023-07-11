import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Theme } from './theme.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ThemeService {
    constructor(
        @InjectRepository(Theme)
        private themeRepository: Repository<Theme>,
    ) {}
}
