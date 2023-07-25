import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordsCollection } from './wordsCollection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WordsCollectionService {
  constructor(
    @InjectRepository(WordsCollection)
    private wordsCollectionRepository: Repository<WordsCollection>,
  ) {}
}
