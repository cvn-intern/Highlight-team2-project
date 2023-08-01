import { Injectable } from '@nestjs/common';
import { WordsCollection } from './wordsCollection.entity';
import { WordsCollectionRepository } from './wordsCollection.repository';
import { WordService } from '../word/word.service';
import { WordType } from './dto/createWordsCollection';

@Injectable()
export class WordsCollectionService {
  constructor(
    private wordsCollectionRepository: WordsCollectionRepository,
    private wordService: WordService,
  ) {}

  async getWordsCollectionByType(
    type: number,
    creator_id: number,
  ): Promise<WordsCollection[]> {
    return await this.wordsCollectionRepository.getWordsCollectionByType(
      type,
      creator_id,
    );
  }

  async createWordsCollection(
    theme_id: number,
    language_code: string,
    creator_id: number,
    is_created_by_system: boolean,
    words_list: WordType[],
  ): Promise<WordsCollection> {
    const words_collection =
      await this.wordsCollectionRepository.createWordsCollection(
        theme_id,
        language_code,
        creator_id,
        is_created_by_system,
      );
    words_list.forEach(async (word) => {
      await this.wordService.createWord(word, words_collection.id);
    });
    return words_collection;
  }
}
