import { Injectable } from '@nestjs/common';
import { WordsCollection } from './wordsCollection.entity';
import { WordsCollectionRepository } from './wordsCollection.repository';

@Injectable()
export class WordsCollectionService {
  constructor(private wordsCollectionRepository: WordsCollectionRepository) {}

  async getWordsCollectionByType(type: number, creator_id: number): Promise<WordsCollection[]> {
    return await this.wordsCollectionRepository.getWordsCollectionByType(type, creator_id);
  }
}
