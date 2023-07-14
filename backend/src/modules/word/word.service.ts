import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WordService {
    constructor(
        @InjectRepository(Word)
        private wordRepository: Repository<Word>,
    ) {}
}
