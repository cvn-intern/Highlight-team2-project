import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWord } from './userWord.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserwordService {
    constructor(
        @InjectRepository(UserWord)
        private userWordRepository: Repository<UserWord>,
    )  {}
}
