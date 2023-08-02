import { HttpStatus, Injectable } from '@nestjs/common';
import { WordsCollection } from './wordsCollection.entity';
import { WordsCollectionRepository } from './wordsCollection.repository';
import { WordService } from '../word/word.service';
import { WordType } from './dto/createWordsCollection';
import { response } from 'express';

@Injectable()
export class WordsCollectionService {
  constructor(private wordsCollectionRepository: WordsCollectionRepository, private wordService: WordService) {}

  async getWordsCollectionByType(type: number, creator_id: number): Promise<WordsCollection[]> {
    return await this.wordsCollectionRepository.getWordsCollectionByType(type, creator_id);
  }

  async getWordsCollectionDetailById(id: number) {
    return await this.wordsCollectionRepository.getWordsCollectionDetailById(id);
  }

  async getWordsCollectionById(id: number): Promise<any> {
    return await this.wordsCollectionRepository.getWordsCollectionById(id);
  }

  async createWordsCollection(
    theme_id: number,
    language_code: string,
    creator_id: number,
    is_created_by_system: boolean,
    words_list: WordType[],
  ): Promise<WordsCollection> {
    const words_collection = await this.wordsCollectionRepository.createWordsCollection(
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

  async updateWordsCollection(
    id: number,
    theme_id: number,
    language_code: string,
    creator_id: number,
    is_created_by_system: boolean,
    words_list: WordType[],
  ): Promise<WordsCollection> {
    const words_collection = await this.wordsCollectionRepository.updateWordsCollection(
      id,
      theme_id,
      language_code,
      creator_id,
      is_created_by_system,
    );
    if (!words_collection) {
      return null;
    }
    // Removes all words in the words collection
    await this.wordService.deleteAllWordsInWordsCollection(id);
    // Readd all words in the words collection
    words_list.forEach(async (word) => {
      await this.wordService.createWord(word, words_collection.id);
    });
    return words_collection;
  }

  async deleteWordsCollection(id: number) {
    await this.wordService.deleteAllWordsInWordsCollection(id);
    await this.wordsCollectionRepository.deleteWordsCollection(id);
  }
}
