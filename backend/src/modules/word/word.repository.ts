import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';

@Injectable()
export class WordRepository extends Repository<Word> {
  constructor(
    @InjectRepository(Word)
    repository: Repository<Word>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
