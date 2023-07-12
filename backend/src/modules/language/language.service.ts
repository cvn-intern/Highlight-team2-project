import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService {
    constructor(
        @InjectRepository(Language)
        private languageRepository: Repository<Language>,
    ) {}

}
